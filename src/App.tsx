import{useState,useEffect,useCallback}from'react'
  const E=["🦁","🐯","🦊","🐼","🐨","🦋","🌟","🍕","🎸","🚀","🌈","🏆","🎯","🦄","💎","🎨"]
  const sh=(a:string[])=>[...a].sort(()=>Math.random()-0.5)
  type Card={id:number;e:string;flipped:boolean;matched:boolean}
  const make=(n:number):Card[]=>sh([...E.slice(0,n),...E.slice(0,n)]).map((e,i)=>({id:i,e,flipped:false,matched:false}))
  const DIFFS=[{l:"Easy",n:6,t:120,cols:3},{l:"Medium",n:10,t:90,cols:5},{l:"Hard",n:16,t:60,cols:4}]
  export default function App(){
    const[di,setDi]=useState(1)
    const[cards,setCards]=useState(()=>make(10))
    const[sel,setSel]=useState<number[]>([])
    const[moves,setMoves]=useState(0)
    const[matched,setMatched]=useState(0)
    const[time,setTime]=useState(90)
    const[going,setGoing]=useState(false)
    const[done,setDone]=useState<"win"|"lose"|null>(null)
    const[lock,setLock]=useState(false)
    const d=DIFFS[di]
    const reset=(i=di)=>{const dd=DIFFS[i];setCards(make(dd.n));setSel([]);setMoves(0);setMatched(0);setTime(dd.t);setGoing(false);setDone(null);setLock(false)}
    useEffect(()=>{if(!going||done)return;const id=setInterval(()=>setTime(t=>{if(t<=1){setDone("lose");return 0}return t-1}),1000);return()=>clearInterval(id)},[going,done])
    const flip=useCallback((id:number)=>{
      if(lock||done)return
      const c=cards[id];if(c.flipped||c.matched||sel.includes(id))return
      if(!going)setGoing(true)
      if(sel.length===1){
        const first=cards[sel[0]]
        setMoves(m=>m+1)
        if(first.e===c.e){
          setCards(cs=>cs.map(x=>x.id===sel[0]||x.id===id?{...x,flipped:true,matched:true}:x))
          const nm=matched+1;setMatched(nm)
          if(nm===d.n)setTimeout(()=>setDone("win"),400)
          setSel([])
        }else{
          setCards(cs=>cs.map(x=>x.id===sel[0]||x.id===id?{...x,flipped:true}:x))
          setSel([id,...sel]);setLock(true)
          setTimeout(()=>{setCards(cs=>cs.map(x=>x.id===sel[0]||x.id===id?{...x,flipped:false}:x));setSel([]);setLock(false)},800)
        }
      }else{setCards(cs=>cs.map(x=>x.id===id?{...x,flipped:true}:x));setSel([id])}
    },[cards,sel,matched,d,going,lock,done])
    return(
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"1rem",padding:"1.5rem"}}>
        <h1 style={{fontWeight:800,fontSize:"1.5rem",color:"#f8fafc"}}>🧠 Memory Game</h1>
        <div style={{display:"flex",gap:"0.5rem"}}>
          {DIFFS.map((x,i)=><button key={x.l} onClick={()=>{setDi(i);reset(i)}} style={{padding:"0.3rem 0.85rem",background:di===i?"#0ea5e9":"#1e293b",color:di===i?"#fff":"#94a3b8",border:"none",borderRadius:6,cursor:"pointer",fontWeight:600,fontSize:"0.82rem"}}>{x.l}</button>)}
        </div>
        <div style={{display:"flex",gap:"1.5rem"}}>
          {[{l:"Moves",v:moves,c:"#38bdf8"},{l:matched+"/"+d.n,v2:"Pairs",c:"#22c55e"},{l:"Time",v:time+"s",c:time<20?"#ef4444":"#f59e0b"}].map(({l,v,v2,c})=>(
            <div key={l} style={{textAlign:"center"}}><div style={{fontSize:"1.2rem",fontWeight:800,color:c}}>{v||l}</div><div style={{color:"#475569",fontSize:"0.7rem"}}>{v2||l}</div></div>
          ))}
        </div>
        <div style={{width:280,height:5,background:"#1e293b",borderRadius:3}}><div style={{height:"100%",background:time/d.t>0.4?"#22c55e":time/d.t>0.2?"#f59e0b":"#ef4444",borderRadius:3,width:(time/d.t*100)+"%",transition:"width 1s linear"}}/></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat("+d.cols+", 62px)",gap:7}}>
          {cards.map(c=>(
            <div key={c.id} onClick={()=>flip(c.id)} style={{width:62,height:62,borderRadius:10,background:c.matched?"#166534":c.flipped?"#1e40af":"#1e293b",border:"2px solid "+(c.matched?"#22c55e":c.flipped?"#3b82f6":"#334155"),display:"flex",alignItems:"center",justifyContent:"center",fontSize:c.flipped||c.matched?"1.7rem":"1.3rem",cursor:c.matched||c.flipped?"default":"pointer",userSelect:"none"}}>{c.flipped||c.matched?c.e:"?"}</div>
          ))}
        </div>
        {done&&(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"1rem",zIndex:10}}>
          <div style={{fontSize:"3rem"}}>{done==="win"?"🏆":"⏰"}</div>
          <div style={{fontWeight:800,fontSize:"1.5rem",color:done==="win"?"#22c55e":"#ef4444"}}>{done==="win"?"You Won!":"Time's Up!"}</div>
          {done==="win"&&<div style={{color:"#94a3b8"}}>In {moves} moves</div>}
          <button onClick={()=>reset()} style={{padding:"0.6rem 1.75rem",background:"#0ea5e9",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:700}}>Play Again</button>
        </div>)}
      </div>
    )
  }