import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, addDoc, onSnapshot, 
  deleteDoc, doc, query, writeBatch, getDocs 
} from 'firebase/firestore';
import { 
  getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged 
} from 'firebase/auth';
import { 
  Search, User, Heart, Share2, 
  X, Loader2, Users, Trash2, RefreshCw, Layers, Image as ImageIcon,
  LogOut, LogIn
} from 'lucide-react';

/* --- FIREBASE CONFIGURATION --- */
const firebaseConfig = {
  apiKey: "AIzaSyDCeV9-wJ7arU214pwrKh-xli-3AravAgg",
  authDomain: "family-nexus-80c52.firebaseapp.com",
  projectId: "family-nexus-80c52",
  storageBucket: "family-nexus-80c52.firebasestorage.app",
  messagingSenderId: "194649684758",
  appId: "1:194649684758:web:c8eb06bc76ac6a3a85ae37"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

/* --- D3 LOADER HELPER --- */
const loadD3 = () => {
  return new Promise((resolve, reject) => {
    if (window.d3) return resolve(window.d3);
    const script = document.createElement('script');
    script.src = "https://d3js.org/d3.v7.min.js";
    script.onload = () => resolve(window.d3);
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

/* --- ALGORITHM: CALCULATE GENERATIONS --- */
const calculateGenerations = (nodes, links) => {
    const nodeMap = new Map(nodes.map(n => [n.id, { ...n, level: 0 }]));
    for (let i = 0; i < nodes.length + 5; i++) {
        let changed = false;
        links.forEach(l => {
            const sId = typeof l.source === 'object' ? l.source.id : l.source;
            const tId = typeof l.target === 'object' ? l.target.id : l.target;
            const source = nodeMap.get(sId);
            const target = nodeMap.get(tId);
            if (!source || !target) return;
            if (l.type === 'parent') {
                if (target.level <= source.level) { target.level = source.level + 1; changed = true; }
            } else if (l.type === 'spouse' || l.type === 'sibling') {
                const maxLevel = Math.max(source.level, target.level);
                if (source.level < maxLevel) { source.level = maxLevel; changed = true; }
                if (target.level < maxLevel) { target.level = maxLevel; changed = true; }
            }
        });
        if (!changed) break;
    }
    return Array.from(nodeMap.values());
};

const getRelationshipLabel = (link, myId, allNodes) => {
  const sId = typeof link.source === 'object' ? link.source.id : link.source;
  const tId = typeof link.target === 'object' ? link.target.id : link.target;
  const isSource = sId === myId;
  const otherId = isSource ? tId : sId;
  const otherNode = allNodes.find(n => n.id === otherId);
  const otherName = otherNode ? otherNode.name : "Unknown Person";
  switch (link.type) {
    case 'parent': return isSource ? `Parent of ${otherName}` : `Child of ${otherName}`;
    case 'spouse': return `Partner of ${otherName}`;
    case 'sibling': return `Sibling of ${otherName}`;
    default: return `Connected to ${otherName}`;
  }
};

/* --- DEFAULT DATA --- */
const DEMO_NODES = [
  { name: "Rickard", family: "Stark", gender: "male" }, 
  { name: "Larra", family: "Stark", gender: "female" }, 
  { name: "Eddard", family: "Stark", gender: "male" },
  { name: "Catelyn", family: "Tully", gender: "female" },
  { name: "Robb", family: "Stark", gender: "male" },
  { name: "Sansa", family: "Stark", gender: "female" },
  { name: "Arya", family: "Stark", gender: "female" },
  { name: "Jon", family: "Snow", gender: "male" },
];
const DEMO_RELATIONSHIPS = [
  { sourceName: "Rickard", targetName: "Eddard", type: "parent" },
  { sourceName: "Rickard", targetName: "Larra", type: "spouse" },
  { sourceName: "Larra", targetName: "Eddard", type: "parent" }, 
  { sourceName: "Eddard", targetName: "Catelyn", type: "spouse" },
  { sourceName: "Eddard", targetName: "Robb", type: "parent" },
  { sourceName: "Catelyn", targetName: "Robb", type: "parent" },
  { sourceName: "Eddard", targetName: "Sansa", type: "parent" },
  { sourceName: "Catelyn", targetName: "Sansa", type: "parent" },
  { sourceName: "Eddard", targetName: "Arya", type: "parent" },
  { sourceName: "Eddard", targetName: "Jon", type: "parent" },
  { sourceName: "Robb", targetName: "Sansa", type: "sibling" },
  { sourceName: "Sansa", targetName: "Arya", type: "sibling" },
];

/* --- COMPONENTS --- */
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-800/50">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [d3Loaded, setD3Loaded] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeFamily, setNewNodeFamily] = useState('');
  const [newNodeGender, setNewNodeGender] = useState('unknown');
  const [newNodeImage, setNewNodeImage] = useState('');
  
  const [linkSource, setLinkSource] = useState('');
  const [linkTarget, setLinkTarget] = useState('');
  const [linkType, setLinkType] = useState('parent');

  const svgRef = useRef(null);
  const simulationRef = useRef(null);
  const containerRef = useRef(null);

  // --- AUTH ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setNodes([]);
    setLinks([]);
  };

  // --- SEEDING LOGIC (PRIVATE) ---
  const seedDatabase = async () => {
    if (!user) return;
    setDataLoading(true);
    try {
      const batch = writeBatch(db);
      const nodeRefs = {}; 
      // NOTE: Using 'users' collection instead of 'public'
      for (const n of DEMO_NODES) {
        const docRef = doc(collection(db, 'artifacts', appId, 'users', user.uid, 'family-nodes'));
        const avatarUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${n.name}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
        batch.set(docRef, { ...n, imageUrl: avatarUrl, createdAt: new Date().toISOString() });
        nodeRefs[n.name] = docRef.id;
      }
      for (const l of DEMO_RELATIONSHIPS) {
        if (nodeRefs[l.sourceName] && nodeRefs[l.targetName]) {
           const linkRef = doc(collection(db, 'artifacts', appId, 'users', user.uid, 'family-links'));
           batch.set(linkRef, {
             source: nodeRefs[l.sourceName],
             target: nodeRefs[l.targetName],
             type: l.type
           });
        }
      }
      await batch.commit();
    } catch (e) { console.error("Seeding failed", e); }
    setDataLoading(false);
  };

  // --- DATA SYNC (PRIVATE) ---
  useEffect(() => {
    if (!user) return;
    loadD3().then(() => setD3Loaded(true));

    // NOTE: Path now includes user.uid
    const qNodes = query(collection(db, 'artifacts', appId, 'users', user.uid, 'family-nodes'));
    const unsubNodes = onSnapshot(qNodes, async (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setNodes(data);
      // Auto-seed only on very first load if empty
      if (snap.empty && !dataLoading) {
         // We check again to be safe
         setDataLoading(true);
         const check = await getDocs(qNodes);
         if (check.empty) seedDatabase();
         else setDataLoading(false);
      }
    });

    const qLinks = query(collection(db, 'artifacts', appId, 'users', user.uid, 'family-links'));
    const unsubLinks = onSnapshot(qLinks, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setLinks(data);
    });

    return () => { unsubNodes(); unsubLinks(); };
  }, [user]);

  // --- D3 GRAPH LOGIC ---
  useEffect(() => {
    if (!d3Loaded || !svgRef.current || nodes.length === 0) return;

    const d3 = window.d3;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    d3.select(svgRef.current).selectAll("*").remove();

    let graphNodes = calculateGenerations(nodes, links);
    let graphLinks = links.map(l => ({ ...l })).filter(l => {
        const s = graphNodes.find(n => n.id === l.source);
        const t = graphNodes.find(n => n.id === l.target);
        return s && t;
    });

    const levelHeight = 180;
    const maxLevel = Math.max(...graphNodes.map(n => n.level));
    const totalContentHeight = maxLevel * levelHeight;
    const verticalOffset = (height - totalContentHeight) / 2;

    const svg = d3.select(svgRef.current).attr("viewBox", [0, 0, width, height]).style("cursor", "grab");
    const g = svg.append("g");
    const zoom = d3.zoom().scaleExtent([0.1, 4]).on("zoom", (event) => g.attr("transform", event.transform));
    svg.call(zoom);

    graphNodes.forEach(n => {
        n.y = verticalOffset + (n.level * levelHeight);
        n.x = width / 2 + (Math.random() - 0.5) * 100;
    });

    const simulation = d3.forceSimulation(graphNodes)
      .force("link", d3.forceLink(graphLinks).id(d => d.id).distance(250)) 
      .force("charge", d3.forceManyBody().strength(-1500)) 
      .force("collide", d3.forceCollide().radius(60).iterations(2)) 
      .force("center", d3.forceCenter(width / 2, height / 2).strength(0.02))
      .force("y", d3.forceY(d => verticalOffset + (d.level * levelHeight)).strength(1.5)); 

    simulationRef.current = simulation;

    svg.append("defs").selectAll("marker")
      .data(["end"]).enter().append("marker")
      .attr("id", "arrow").attr("viewBox", "0 -5 10 10").attr("refX", 38).attr("refY", 0)
      .attr("markerWidth", 6).attr("markerHeight", 6).attr("orient", "auto")
      .append("path").attr("fill", "#94a3b8").attr("d", "M0,-5L10,0L0,5");

    const linkGroup = g.append("g").selectAll("g").data(graphLinks).join("g");
    const linkLine = linkGroup.append("line")
      .attr("stroke", d => d.type === 'spouse' ? "#f472b6" : d.type === 'sibling' ? "#60a5fa" : "#64748b")
      .attr("stroke-width", d => d.type === 'spouse' ? 2 : 1.5)
      .attr("stroke-dasharray", d => d.type === 'spouse' ? "5,5" : "0")
      .attr("marker-end", d => d.type === 'parent' ? "url(#arrow)" : null);

    const linkHitBox = linkGroup.append("line")
      .attr("stroke", "transparent").attr("stroke-width", 20).style("cursor", "pointer")
      .on("mouseover", (event, d) => {
          const sName = d.source.name || "Unknown";
          const tName = d.target.name || "Unknown";
          let label = `${sName} -> ${tName}`;
          if (d.type === 'spouse') label = `${sName} ❤️ ${tName}`;
          if (d.type === 'parent') label = `${sName} is parent of ${tName}`;
          setHoveredLink({ x: event.pageX, y: event.pageY, label });
          d3.select(event.target.previousSibling).attr("stroke-width", 3).attr("stroke", "#fff");
      })
      .on("mousemove", (event) => setHoveredLink(prev => prev ? ({ ...prev, x: event.pageX, y: event.pageY }) : null))
      .on("mouseout", (event) => {
          setHoveredLink(null);
          d3.select(event.target.previousSibling)
            .attr("stroke-width", d => d.type === 'spouse' ? 2 : 1.5).attr("stroke", d => d.type === 'spouse' ? "#f472b6" : d.type === 'sibling' ? "#60a5fa" : "#64748b");
      });

    const node = g.append("g").selectAll("g").data(graphNodes).join("g")
      .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));

    node.append("circle")
      .attr("r", 32).attr("fill", "#1e293b")
      .attr("stroke", d => {
        let hash = 0;
        const str = d.family || 'Unknown';
        for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
        const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
        return "#" + "00000".substring(0, 6 - c.length) + c;
      })
      .attr("stroke-width", 3)
      .attr("opacity", d => {
         if (!searchQuery) return 1;
         const match = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.family.toLowerCase().includes(searchQuery.toLowerCase());
         return match ? 1 : 0.15;
      });

    node.append("image")
      .attr("href", d => d.imageUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${d.name}`)
      .attr("x", -28).attr("y", -28).attr("width", 56).attr("height", 56)
      .style("clip-path", "circle(50%)").style("pointer-events", "none")
      .attr("opacity", d => {
         if (!searchQuery) return 1;
         const match = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.family.toLowerCase().includes(searchQuery.toLowerCase());
         return match ? 1 : 0.4;
      });

    node.append("text").text(d => d.name).attr("x", 0).attr("y", 46).attr("text-anchor", "middle").attr("fill", "#e2e8f0").attr("font-size", "12px").style("pointer-events", "none").style("text-shadow", "0px 2px 4px rgba(0,0,0,0.9)");

    node.on("click", (event, d) => {
      event.stopPropagation();
      const original = nodes.find(n => n.id === d.id);
      setSelectedNode(original || d);
    });

    simulation.on("tick", () => {
      linkLine.attr("x1", d => d.source.x).attr("y1", d => d.source.y).attr("x2", d => d.target.x).attr("y2", d => d.target.y);
      linkHitBox.attr("x1", d => d.source.x).attr("y1", d => d.source.y).attr("x2", d => d.target.x).attr("y2", d => d.target.y);
      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event, d) { if (!event.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; }
    function dragged(event, d) { d.fx = event.x; d.fy = event.y; }
    function dragended(event, d) { if (!event.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; }

    return () => simulation.stop();
  }, [d3Loaded, nodes, links, searchQuery]);

  // --- ACTIONS (PRIVATE) ---
  const handleAddNode = async () => {
    if (!newNodeName || !newNodeFamily || !user) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'family-nodes'), {
        name: newNodeName, family: newNodeFamily, gender: newNodeGender, 
        imageUrl: newNodeImage || `https://api.dicebear.com/9.x/avataaars/svg?seed=${newNodeName}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
        createdAt: new Date().toISOString()
      });
      setIsAddNodeOpen(false); setNewNodeName(''); setNewNodeImage('');
    } catch (e) { console.error(e); }
  };
  const handleAddLink = async () => {
    if (!linkSource || !linkTarget || !linkType || !user) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'family-links'), {
        source: linkSource, target: linkTarget, type: linkType
      });
      setIsAddLinkOpen(false); setLinkSource(''); setLinkTarget('');
    } catch (e) { console.error(e); }
  };
  const deleteNode = async () => {
    if(!selectedNode || !user) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'family-nodes', selectedNode.id));
      const relatedLinks = links.filter(l => l.source === selectedNode.id || l.source.id === selectedNode.id || l.target === selectedNode.id || l.target.id === selectedNode.id);
      const batch = writeBatch(db);
      relatedLinks.forEach(l => batch.delete(doc(db, 'artifacts', appId, 'users', user.uid, 'family-links', l.id)));
      await batch.commit();
      setSelectedNode(null);
    } catch(e) { console.error(e); }
  };
  const resetAll = async () => {
      if (!confirm("Delete all and reset?")) return;
      const batch = writeBatch(db);
      nodes.forEach(n => batch.delete(doc(db, 'artifacts', appId, 'users', user.uid, 'family-nodes', n.id)));
      links.forEach(l => batch.delete(doc(db, 'artifacts', appId, 'users', user.uid, 'family-links', l.id)));
      await batch.commit();
  };
  const getMyLinks = () => {
    if (!selectedNode) return [];
    return links.filter(l => {
      const sId = typeof l.source === 'object' ? l.source.id : l.source;
      const tId = typeof l.target === 'object' ? l.target.id : l.target;
      return sId === selectedNode.id || tId === selectedNode.id;
    });
  };

  // --- RENDER ---
  if (authLoading) return <div className="h-screen bg-slate-950 flex items-center justify-center text-slate-500"><Loader2 className="animate-spin" /></div>;

  // LOGIN SCREEN
  if (!user) {
    return (
      <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-emerald-500/10 p-4 rounded-xl text-emerald-400"><Share2 size={48} /></div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Family Nexus</h1>
          <p className="text-slate-400 mb-8">Visualise your history. Securely stored in your private cloud.</p>
          
          <button onClick={handleLogin} className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-all transform hover:scale-[1.02]">
            <LogIn size={20} />
            Sign in with Google
          </button>
          <p className="text-xs text-slate-500 mt-4">By signing in, you create a private database only you can access.</p>
        </div>
      </div>
    );
  }

  // MAIN APP
  if (!d3Loaded) return <div className="h-screen bg-slate-950 flex items-center justify-center text-emerald-500"><Loader2 className="animate-spin mr-2" /> Loading Engine...</div>;

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden text-slate-200 font-sans selection:bg-emerald-500/30">
      
      {/* HEADER */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 pointer-events-none">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center max-w-7xl mx-auto gap-3">
          <div className="pointer-events-auto bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-2 pr-4 rounded-2xl shadow-xl flex items-center gap-3">
             {user.photoURL ? 
                <img src={user.photoURL} className="w-10 h-10 rounded-xl" alt="User" /> : 
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500"><User size={20}/></div>
             }
             <div>
               <h1 className="font-bold text-white text-sm leading-tight">Welcome, {user.displayName?.split(' ')[0]}</h1>
               <p className="text-[10px] text-slate-400">Private Database Active</p>
             </div>
          </div>
          <div className="pointer-events-auto flex gap-2">
            <div className="relative group bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl">
              <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
              <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm rounded-xl pl-10 pr-4 py-2 w-48 focus:outline-none text-white placeholder-slate-500" />
            </div>
            <button onClick={resetAll} className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-2 rounded-2xl text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all"><RefreshCw size={20} /></button>
            <button onClick={handleLogout} className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-2 rounded-2xl text-slate-400 hover:text-white transition-all"><LogOut size={20} /></button>
          </div>
        </div>
      </div>

      {/* GRAPH CONTAINER */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black" onClick={() => setSelectedNode(null)}>
        {nodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-60">
                <p className="text-slate-500 mb-4">Your family tree is empty.</p>
                <button onClick={seedDatabase} className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-500">
                    {dataLoading ? <Loader2 className="animate-spin inline mr-2"/> : null} Load Demo Data
                </button>
            </div>
        ) : <svg ref={svgRef} className="w-full h-full block" />}
      </div>

      {/* TOOLTIP */}
      {hoveredLink && (
        <div className="absolute z-50 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg border border-slate-600 pointer-events-none transform -translate-x-1/2 -translate-y-full"
            style={{ left: hoveredLink.x, top: hoveredLink.y - 10 }}>{hoveredLink.label}</div>
      )}

      {/* LEGEND */}
      <div className="absolute bottom-6 left-6 z-10 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-4 rounded-xl hidden md:block">
          <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Hierarchy</h4>
          <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center gap-2"><Layers size={14} className="text-slate-500"/><span className="text-slate-300">Vertical Alignment by Generation</span></div>
              <div className="flex items-center gap-2"><div className="w-8 h-0.5 bg-slate-400"></div><span className="text-slate-300">Parent / Child</span></div>
              <div className="flex items-center gap-2"><div className="w-8 h-0 border-t-2 border-pink-400 border-dashed"></div><span className="text-slate-300">Spouse</span></div>
          </div>
      </div>

      {/* FABs */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-3">
        <button onClick={() => setIsAddNodeOpen(true)} className="group relative flex items-center justify-center w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-900/20 transition-all hover:scale-105 active:scale-95">
          <User size={24} /><span className="absolute right-16 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Add Person</span>
        </button>
        <button onClick={() => setIsAddLinkOpen(true)} className="group relative flex items-center justify-center w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-900/20 transition-all hover:scale-105 active:scale-95">
          <Heart size={24} /><span className="absolute right-16 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Link People</span>
        </button>
      </div>

      {/* SELECTED NODE PANEL */}
      {selectedNode && (
        <div className="absolute top-24 right-4 md:right-6 z-20 w-80 max-h-[calc(100vh-120px)] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl p-6 animate-in slide-in-from-right duration-300">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-600 shadow-md">
                  <img src={selectedNode.imageUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${selectedNode.name}`} alt={selectedNode.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white leading-none mb-1">{selectedNode.name}</h2>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-xs">{selectedNode.family}</span>
                    <span className="text-xs opacity-70">Generation {selectedNode.level + 1}</span>
                </div>
              </div>
            </div>
            <button onClick={() => setSelectedNode(null)} className="text-slate-500 hover:text-white"><X size={20}/></button>
          </div>
          <div className="space-y-6">
             <div>
                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2"><Users size={12} /> Family Connections</h3>
                 <div className="space-y-2">
                     {getMyLinks().length === 0 ? <p className="text-sm text-slate-600 italic">No connections yet.</p> : 
                         getMyLinks().map(link => (
                             <div key={link.id} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 flex items-center justify-between group hover:border-slate-600 transition-colors">
                                 <span className="text-sm text-slate-300 font-medium">{getRelationshipLabel(link, selectedNode.id, nodes)}</span>
                                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: link.type === 'spouse' ? '#f472b6' : link.type === 'sibling' ? '#60a5fa' : '#94a3b8' }}/>
                             </div>
                         ))
                     }
                 </div>
             </div>
            <div className="pt-4 border-t border-slate-800">
                <button onClick={deleteNode} className="w-full flex items-center justify-center gap-2 bg-red-500/5 hover:bg-red-500/10 text-red-500/80 hover:text-red-500 py-3 rounded-xl text-sm font-medium transition-colors"><Trash2 size={16} /> Delete {selectedNode.name}</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NODE MODAL */}
      <Modal isOpen={isAddNodeOpen} onClose={() => setIsAddNodeOpen(false)} title="Add Family Member">
        <div className="space-y-4">
          <div><label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
            <input className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-emerald-500/50 focus:outline-none" placeholder="e.g. Arya Stark" value={newNodeName} onChange={(e) => setNewNodeName(e.target.value)}/></div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1">Family</label>
            <input className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-emerald-500/50 focus:outline-none" placeholder="e.g. Stark" value={newNodeFamily} onChange={(e) => setNewNodeFamily(e.target.value)}/></div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1">Avatar URL (Optional)</label>
            <div className="flex gap-2">
                 <input className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-emerald-500/50 focus:outline-none" placeholder="https://..." value={newNodeImage} onChange={(e) => setNewNodeImage(e.target.value)}/>
                 <div className="w-10 h-10 rounded bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                     {newNodeImage ? <img src={newNodeImage} alt="Preview" className="w-full h-full object-cover"/> : <ImageIcon size={16} className="text-slate-500"/>}
                 </div>
            </div>
          </div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1">Gender</label>
            <select className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-emerald-500/50 focus:outline-none" value={newNodeGender} onChange={(e) => setNewNodeGender(e.target.value)}>
              <option value="male">Male</option><option value="female">Female</option><option value="unknown">Other</option></select></div>
          <button onClick={handleAddNode} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg transition-colors mt-2">Add Person</button>
        </div>
      </Modal>

      {/* ADD LINK MODAL */}
      <Modal isOpen={isAddLinkOpen} onClose={() => setIsAddLinkOpen(false)} title="Connect People">
        <div className="space-y-4">
           {nodes.length < 2 ? <p className="text-center text-slate-400 py-4 text-sm">Need at least 2 people to create a link.</p> : <>
              <div><label className="block text-xs font-medium text-slate-400 mb-1">Source Person</label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none" value={linkSource} onChange={(e) => setLinkSource(e.target.value)}>
                  <option value="">Select...</option>{nodes.map(n => <option key={n.id} value={n.id}>{n.name} ({n.family})</option>)}</select></div>
              <div><label className="block text-xs font-medium text-slate-400 mb-1">Relationship</label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none" value={linkType} onChange={(e) => setLinkType(e.target.value)}>
                  <option value="parent">Parent of (Source is Parent)</option><option value="spouse">Spouse/Partner</option><option value="sibling">Sibling</option></select></div>
              <div><label className="block text-xs font-medium text-slate-400 mb-1">Target Person</label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none" value={linkTarget} onChange={(e) => setLinkTarget(e.target.value)}>
                  <option value="">Select...</option>{nodes.filter(n => n.id !== linkSource).map(n => <option key={n.id} value={n.id}>{n.name} ({n.family})</option>)}</select></div>
              <button onClick={handleAddLink} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition-colors mt-2">Connect</button>
             </>}
        </div>
      </Modal>
    </div>
  );
}
