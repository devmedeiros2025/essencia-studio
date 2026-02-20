"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

// ─── Palette ──────────────────────────────────────────────────────────
const C = {
  sage: "#7A9E7E", sageDark: "#5C7C60", sageLight: "#C8DBC9",
  cream: "#F7F4EF", sand: "#E8E0D4", terracotta: "#C47C5A",
  white: "#FFFFFF", text: "#2C3027", textMuted: "#7A7A6E", border: "#E0D9CF",
};

const css = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'DM Sans',sans-serif;background:${C.cream};color:${C.text};}
  .app{max-width:420px;margin:0 auto;min-height:100vh;background:${C.white};position:relative;box-shadow:0 0 60px rgba(0,0,0,0.12);}
  .fd{font-family:'Cormorant Garamond',serif;}
  .btn{display:flex;align-items:center;justify-content:center;width:100%;padding:14px 20px;border-radius:50px;font-family:'DM Sans',sans-serif;font-weight:500;font-size:14px;letter-spacing:.08em;text-transform:uppercase;border:none;cursor:pointer;transition:all .2s;}
  .btn-p{background:${C.sage};color:#fff;} .btn-p:hover{background:${C.sageDark};} .btn-p:disabled{background:${C.sageLight};cursor:not-allowed;}
  .btn-t{background:${C.terracotta};color:#fff;} .btn-t:hover{background:#B06B4A;}
  .btn-o{background:transparent;color:${C.terracotta};border:1.5px solid ${C.terracotta};} .btn-o:hover{background:${C.terracotta};color:#fff;}
  .btn-g{background:#fff;color:#3c4043;border:1px solid #dadce0;display:flex;align-items:center;justify-content:center;gap:10px;} .btn-g:hover{background:#f8f8f8;}
  .input{width:100%;padding:13px 16px;border-radius:12px;border:1.5px solid ${C.border};background:${C.cream};font-family:'DM Sans',sans-serif;font-size:15px;color:${C.text};outline:none;transition:border .2s;}
  .input:focus{border-color:${C.sage};}
  .lbl{font-size:12px;font-weight:500;color:${C.textMuted};margin-bottom:6px;letter-spacing:.06em;text-transform:uppercase;display:block;}
  .err{background:#FEE2E2;color:#DC2626;padding:10px 14px;border-radius:10px;font-size:13px;margin-bottom:12px;}
  .ok{background:#DCFCE7;color:#16A34A;padding:10px 14px;border-radius:10px;font-size:13px;margin-bottom:12px;}
  .bnav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:420px;max-width:100%;background:${C.white};border-top:1px solid ${C.border};display:flex;padding:10px 0 20px;z-index:100;}
  .ni{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;padding:4px 0;font-size:10px;color:${C.textMuted};font-weight:500;transition:color .2s;background:none;border:none;font-family:'DM Sans',sans-serif;}
  .ni.on{color:${C.sage};}
  .svc{display:flex;align-items:center;gap:14px;padding:14px 16px;border-bottom:1px solid ${C.border};cursor:pointer;transition:background .15s;}
  .svc:hover{background:${C.cream};}
  .tag{display:inline-flex;align-items:center;padding:5px 14px;border-radius:50px;font-size:13px;font-weight:500;cursor:pointer;border:1.5px solid ${C.border};transition:all .2s;white-space:nowrap;}
  .tag.on{background:${C.sage};color:#fff;border-color:${C.sage};}
  .pkg{background:${C.cream};border:1.5px solid ${C.border};border-radius:12px;padding:10px 14px;cursor:pointer;transition:all .2s;text-align:center;}
  .pkg.on,.pkg:hover{border-color:${C.sage};background:${C.sageLight};}
  .cday{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;cursor:pointer;transition:all .15s;}
  .cday:hover{background:${C.sageLight};} .cday.today{background:${C.sage};color:#fff;font-weight:600;} .cday.sel{background:${C.sageDark};color:#fff;}
  .tslot{padding:10px 16px;border-radius:10px;border:1.5px solid ${C.border};font-size:14px;cursor:pointer;transition:all .15s;text-align:center;background:${C.white};}
  .tslot:hover{border-color:${C.sage};} .tslot.on{background:${C.sage};color:#fff;border-color:${C.sage};}
  .prog{height:6px;background:${C.sand};border-radius:99px;overflow:hidden;}
  .progf{height:100%;border-radius:99px;background:${C.terracotta};transition:width .4s;}
  .splash-bg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 60% 30%,${C.sageLight} 0%,transparent 70%),radial-gradient(ellipse 60% 50% at 20% 80%,#E8D5C4 0%,transparent 70%),${C.cream};}
  .appt{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid ${C.border};}
  .appt:last-child{border-bottom:none;}
  .ava{width:42px;height:42px;border-radius:50%;background:${C.sageLight};display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:${C.sageDark};flex-shrink:0;}
  .stitle{font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:${C.textMuted};margin-bottom:12px;}
  .badge{display:inline-flex;align-items:center;gap:6px;background:#DCFCE7;color:#16A34A;padding:4px 10px;border-radius:50px;font-size:11px;font-weight:600;}
  .page{animation:fi .25s ease;}
  @keyframes fi{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
  .toast{position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:${C.sageDark};color:#fff;padding:12px 24px;border-radius:50px;font-size:14px;font-weight:500;z-index:999;animation:ti .3s ease;white-space:nowrap;}
  @keyframes ti{from{opacity:0;transform:translateX(-50%) translateY(10px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}
  .spin{width:18px;height:18px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:sp .7s linear infinite;display:inline-block;margin-right:8px;vertical-align:middle;}
  @keyframes sp{to{transform:rotate(360deg);}}
  .divider{display:flex;align-items:center;gap:12px;margin:16px 0;color:${C.textMuted};font-size:13px;}
  .divider::before,.divider::after{content:'';flex:1;height:1px;background:${C.border};}
  .pban{height:140px;background:linear-gradient(135deg,${C.sageLight} 0%,${C.sand} 100%);position:relative;}
`;

const SERVICES = [
  { id:1,name:"Pilates",price:65,emoji:"🧘",rating:4.9,desc:"Sessões individualizadas com foco em postura, força e equilíbrio corporal.",packages:[{label:"Sessão Avulsa",price:75},{label:"5 Sessões",price:350},{label:"10 Sessões",price:650},{label:"20 Sessões",price:1200}],professionals:["Ana","Carlos","Patrícia"] },
  { id:2,name:"Massagem",price:120,emoji:"💆",rating:4.8,desc:"Massagem terapêutica relaxante para alívio de tensões musculares.",packages:[{label:"Sessão Avulsa",price:120},{label:"5 Sessões",price:550},{label:"10 Sessões",price:1000}],professionals:["Maria","Fernanda"] },
  { id:3,name:"Drenagem",price:110,emoji:"✨",rating:4.7,desc:"Drenagem linfática manual para redução de inchaço e melhora da circulação.",packages:[{label:"Sessão Avulsa",price:110},{label:"10 Sessões",price:950}],professionals:["Fernanda"] },
  { id:4,name:"Liberação Miofascial",price:130,emoji:"🤸",rating:4.9,desc:"Técnica especializada para liberação de tensões profundas.",packages:[{label:"Sessão Avulsa",price:130},{label:"5 Sessões",price:600}],professionals:["Carlos","Ana"] },
];
const TIMES = ["8:00","9:00","10:00","11:00","13:00","14:00","15:00","16:00","17:00","18:00"];

// ─── Google SVG icon ──────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

// ─── Auth ─────────────────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("splash");
  const [f, setF] = useState({ name:"", email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const upd = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  const doGoogle = async () => {
    setGLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const doLogin = async () => {
    setErr(""); setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: f.email, password: f.password });
    setLoading(false);
    if (error) { setErr(error.message); return; }
    onAuth(data.user);
  };

  const doRegister = async () => {
    if (!f.name || !f.email || !f.password) { setErr("Preencha todos os campos."); return; }
    setErr(""); setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: f.email, password: f.password,
      options: { data: { full_name: f.name } },
    });
    setLoading(false);
    if (error) { setErr(error.message); return; }
    if (data.session) { onAuth(data.user); }
    else { setOk("✅ Confirme seu e-mail para ativar a conta!"); setMode("login"); }
  };

  if (mode === "splash") return (
    <div className="page" style={{ height:"100vh", position:"relative", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:32, padding:40 }}>
      <div className="splash-bg" />
      <div style={{ position:"relative", textAlign:"center" }}>
        <div style={{ fontSize:64, marginBottom:8 }}>🌿</div>
        <h1 className="fd" style={{ fontSize:50, fontWeight:300, color:C.text, lineHeight:1.1 }}>Essência<br/><em>Studio</em></h1>
        <p style={{ marginTop:14, color:C.textMuted, fontSize:14 }}>Pilates & Fisioterapia</p>
      </div>
      <div style={{ position:"relative", width:"100%", display:"flex", flexDirection:"column", gap:12 }}>
        <button className="btn btn-t" onClick={() => setMode("login")}>Entrar</button>
        <button className="btn btn-o" onClick={() => setMode("register")}>Criar Conta</button>
        <div className="divider">ou</div>
        <button className="btn btn-g" onClick={doGoogle} disabled={gLoading}>
          {gLoading ? <span className="spin" style={{ borderTopColor:C.sage, borderColor:C.border }} /> : <GoogleIcon />}
          {gLoading ? "Redirecionando..." : "Continuar com Google"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="page" style={{ padding:"60px 28px 40px", minHeight:"100vh" }}>
      <button onClick={() => { setMode("splash"); setErr(""); setOk(""); }} style={{ background:"none", border:"none", cursor:"pointer", fontSize:22, marginBottom:24, color:C.textMuted }}>←</button>
      <h2 className="fd" style={{ fontSize:38, fontWeight:300, marginBottom:6 }}>{mode === "login" ? "Bem-vinda 🌿" : "Criar conta"}</h2>
      <p style={{ color:C.textMuted, fontSize:14, marginBottom:24 }}>{mode === "login" ? "Acesse sua conta" : "Preencha seus dados"}</p>
      {err && <div className="err">⚠️ {err}</div>}
      {ok && <div className="ok">{ok}</div>}
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {mode === "register" && <div><label className="lbl">Nome completo</label><input className="input" placeholder="Ana Silva" value={f.name} onChange={upd("name")} /></div>}
        <div><label className="lbl">E-mail</label><input className="input" type="email" placeholder="seu@email.com" value={f.email} onChange={upd("email")} /></div>
        <div><label className="lbl">Senha</label><input className="input" type="password" placeholder="mínimo 6 caracteres" value={f.password} onChange={upd("password")} /></div>
        <button className="btn btn-p" style={{ marginTop:6 }} disabled={loading} onClick={mode === "login" ? doLogin : doRegister}>
          {loading && <span className="spin" />}{loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar Conta"}
        </button>
        <div className="divider">ou</div>
        <button className="btn btn-g" onClick={doGoogle} disabled={gLoading}>
          {gLoading ? <span className="spin" style={{ borderTopColor:C.sage, borderColor:C.border }} /> : <GoogleIcon />}
          {gLoading ? "Redirecionando..." : "Continuar com Google"}
        </button>
        <p style={{ textAlign:"center", fontSize:13, color:C.textMuted, marginTop:4 }}>
          {mode === "login" ? "Não tem conta? " : "Já tem conta? "}
          <span style={{ color:C.sage, cursor:"pointer", fontWeight:600 }} onClick={() => { setMode(mode==="login"?"register":"login"); setErr(""); setOk(""); }}>
            {mode === "login" ? "Cadastre-se" : "Entrar"}
          </span>
        </p>
      </div>
    </div>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────
function HomeScreen({ user, onSelect }) {
  const name = user?.user_metadata?.full_name?.split(" ")[0] || user?.user_metadata?.name?.split(" ")[0] || user?.email?.split("@")[0] || "Cliente";
  const avatar = user?.user_metadata?.avatar_url;
  return (
    <div className="page" style={{ paddingBottom:90 }}>
      <div style={{ background:`linear-gradient(135deg,${C.sageLight} 0%,${C.sand} 100%)`, padding:"44px 24px 24px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-20, right:-30, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,.25)" }} />
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <p style={{ fontSize:13, color:C.sageDark, marginBottom:4 }}>📍 Rua das Acácias, 123</p>
            <h2 className="fd" style={{ fontSize:30, fontWeight:300 }}>Olá, <strong>{name}</strong> 🌿</h2>
          </div>
          {avatar && <img src={avatar} alt="" style={{ width:44, height:44, borderRadius:"50%", border:`2px solid ${C.white}` }} />}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:8 }}>
          <span style={{ color:"#F5A623" }}>★★★★★</span>
          <span style={{ fontSize:13, fontWeight:600 }}>4.9</span>
          <span style={{ fontSize:13, color:C.textMuted }}>(127 avaliações)</span>
        </div>
      </div>
      <div style={{ padding:"18px 20px 0", display:"flex", gap:10, overflowX:"auto" }}>
        {["Todos","Pilates","Massagem","Terapias"].map((t,i) => <span key={t} className={`tag ${i===0?"on":""}`}>{t}</span>)}
      </div>
      <div style={{ padding:"18px 20px" }}>
        <div className="stitle">Serviços Populares</div>
        <div style={{ border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden" }}>
          {SERVICES.map(s => (
            <div key={s.id} className="svc" onClick={() => onSelect(s)}>
              <div style={{ width:68, height:52, borderRadius:10, background:C.sageLight, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{s.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:15 }}>{s.name}</div>
                <div style={{ fontSize:13, color:C.textMuted, marginTop:2 }}>{s.desc.slice(0,46)}…</div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontWeight:600, color:C.sage }}>R${s.price}</div>
                <div style={{ fontSize:12, color:C.textMuted }}>→</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Detail ───────────────────────────────────────────────────────────
function DetailScreen({ svc, onBook, onBack }) {
  const [sel, setSel] = useState(0);
  return (
    <div className="page" style={{ paddingBottom:100 }}>
      <div style={{ height:190, background:`linear-gradient(135deg,${C.sageLight},${C.sand})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:70, position:"relative" }}>
        {svc.emoji}
        <button onClick={onBack} style={{ position:"absolute", top:48, left:16, background:"rgba(255,255,255,.85)", border:"none", width:36, height:36, borderRadius:"50%", cursor:"pointer", fontSize:16 }}>←</button>
      </div>
      <div style={{ padding:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <h2 className="fd" style={{ fontSize:34, fontWeight:300 }}>{svc.name}</h2>
          <span style={{ fontWeight:600 }}>⭐ {svc.rating}</span>
        </div>
        <p style={{ color:C.textMuted, fontSize:14, lineHeight:1.6, marginBottom:20 }}>{svc.desc}</p>
        <div className="stitle">Pacotes</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
          {svc.packages.map((p,i) => (
            <div key={i} className={`pkg ${sel===i?"on":""}`} onClick={() => setSel(i)}>
              <div style={{ fontSize:11, color:C.textMuted }}>{p.label}</div>
              <div style={{ fontSize:15, fontWeight:600, color:C.sage }}>R${p.price}</div>
            </div>
          ))}
        </div>
        <div className="stitle">Profissionais</div>
        <div style={{ display:"flex", gap:12, marginBottom:24 }}>
          {svc.professionals.map(p => (
            <div key={p} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
              <div className="ava">{p[0]}</div>
              <span style={{ fontSize:11, color:C.textMuted }}>{p}</span>
            </div>
          ))}
        </div>
        <button className="btn btn-p" onClick={() => onBook(svc, svc.packages[sel])}>🗓 Escolher Horário</button>
      </div>
    </div>
  );
}

// ─── Booking ──────────────────────────────────────────────────────────
function BookingScreen({ svc, pkg, onConfirm, onBack }) {
  const [day, setDay] = useState(12);
  const [time, setTime] = useState("14:00");
  return (
    <div className="page" style={{ padding:"24px 24px 100px" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", fontSize:22, marginBottom:20, color:C.textMuted }}>←</button>
      <h2 className="fd" style={{ fontSize:30, fontWeight:300, marginBottom:4 }}>Agendar</h2>
      <p style={{ color:C.textMuted, fontSize:14, marginBottom:22 }}>{svc.name} · {pkg.label} · R${pkg.price}</p>
      <div className="stitle">Março 2025</div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:22 }}>
        {[10,11,12,13,14,15,16].map((d,i) => (
          <div key={d} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:11, color:C.textMuted }}>{["L","M","M","J","V","S","D"][i]}</span>
            <div className={`cday ${d===12?"today":""} ${day===d&&d!==12?"sel":""}`} onClick={() => setDay(d)}>{d}</div>
          </div>
        ))}
      </div>
      <div className="stitle">Horários</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:28 }}>
        {TIMES.map(t => <div key={t} className={`tslot ${time===t?"on":""}`} onClick={() => setTime(t)}>{t}</div>)}
      </div>
      <button className="btn btn-p" onClick={() => onConfirm({ svc, pkg, day, time })}>Confirmar</button>
    </div>
  );
}

// ─── Payment ──────────────────────────────────────────────────────────
function PaymentScreen({ booking, onPay, onBack }) {
  const [method, setMethod] = useState("card");
  const [f, setF] = useState({ number:"", name:"", exp:"", cvv:"" });
  const [loading, setLoading] = useState(false);
  const upd = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const pay = async () => { setLoading(true); await new Promise(r => setTimeout(r, 1400)); setLoading(false); onPay(); };
  return (
    <div className="page" style={{ padding:"24px 24px 100px" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", fontSize:22, marginBottom:20, color:C.textMuted }}>←</button>
      <h2 className="fd" style={{ fontSize:30, fontWeight:300, marginBottom:20 }}>Pagamento</h2>
      <div style={{ background:C.cream, borderRadius:16, padding:16, marginBottom:22 }}>
        {[["Serviço",booking.svc.name],["Pacote",booking.pkg.label],["Data",`Mar ${booking.day} · ${booking.time}`]].map(([l,v]) => (
          <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ color:C.textMuted, fontSize:14 }}>{l}</span><span style={{ fontWeight:500 }}>{v}</span>
          </div>
        ))}
        <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:10, marginTop:4, display:"flex", justifyContent:"space-between" }}>
          <span style={{ fontWeight:600 }}>Total</span>
          <span style={{ fontWeight:700, fontSize:18, color:C.sage }}>R${booking.pkg.price}</span>
        </div>
      </div>
      <div style={{ display:"flex", gap:10, marginBottom:18 }}>
        {[["card","💳 Cartão"],["pix","Pix"]].map(([v,l]) => (
          <div key={v} className={`pkg ${method===v?"on":""}`} style={{ flex:1 }} onClick={() => setMethod(v)}><div style={{ fontWeight:500 }}>{l}</div></div>
        ))}
      </div>
      {method === "card" && (
        <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:22 }}>
          <div><label className="lbl">Número</label><input className="input" placeholder="0000 0000 0000 0000" value={f.number} onChange={upd("number")} /></div>
          <div><label className="lbl">Nome</label><input className="input" placeholder="ANA SILVA" value={f.name} onChange={upd("name")} /></div>
          <div style={{ display:"flex", gap:10 }}>
            <div style={{ flex:1 }}><label className="lbl">Validade</label><input className="input" placeholder="MM/AA" value={f.exp} onChange={upd("exp")} /></div>
            <div style={{ flex:1 }}><label className="lbl">CVV</label><input className="input" placeholder="•••" value={f.cvv} onChange={upd("cvv")} /></div>
          </div>
        </div>
      )}
      {method === "pix" && <div style={{ textAlign:"center", padding:"20px 0 26px" }}><div style={{ fontSize:72 }}>📱</div><p style={{ color:C.textMuted, fontSize:14, marginTop:10 }}>QR Code gerado após confirmar.</p></div>}
      <button className="btn btn-p" disabled={loading} onClick={pay}>
        {loading && <span className="spin" />}{loading ? "Processando..." : method==="card" ? `Pagar R$${booking.pkg.price}` : `Gerar Pix · R$${booking.pkg.price}`}
      </button>
    </div>
  );
}

// ─── Appointments ─────────────────────────────────────────────────────
function AppointmentsScreen() {
  const [tab, setTab] = useState("up");
  const data = {
    up: [{id:1,label:"Hoje",time:"14:30",svc:"Pilates"},{id:2,label:"Amanhã",time:"10:00",svc:"Massagem",rs:true}],
    hist: [{id:3,label:"Hoje, 14:30",svc:"Pilates"},{id:4,label:"Amanhã, 10:00",svc:"Massagem"},{id:5,label:"Seg, 10:00",svc:"Drenagem"}],
  };
  return (
    <div className="page" style={{ padding:"56px 20px 100px" }}>
      <h2 className="fd" style={{ fontSize:30, fontWeight:300, marginBottom:20 }}>Meus Agendamentos</h2>
      <div style={{ display:"flex", background:C.cream, borderRadius:12, padding:4, marginBottom:22 }}>
        {[["up","Próximos"],["hist","Histórico"]].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)} style={{ flex:1, padding:"9px", border:"none", cursor:"pointer", borderRadius:10, fontSize:14, fontWeight:500, background:tab===v?C.white:"transparent", color:tab===v?C.text:C.textMuted, fontFamily:"'DM Sans',sans-serif", transition:"all .2s", boxShadow:tab===v?"0 1px 4px rgba(0,0,0,.08)":"none" }}>{l}</button>
        ))}
      </div>
      {data[tab].map(a => (
        <div key={a.id} className="appt">
          <div style={{ display:"flex", gap:14, alignItems:"center" }}>
            <div className="ava">{a.svc[0]}</div>
            <div>
              <div style={{ fontWeight:600 }}>{a.label}</div>
              <div style={{ fontSize:13, color:C.textMuted }}>{a.time ? `${a.time} · ` : ""}{a.svc}</div>
              {a.rs && <span style={{ display:"inline-block", marginTop:4, background:C.sand, color:C.textMuted, borderRadius:50, padding:"3px 10px", fontSize:11 }}>Reagendar</span>}
            </div>
          </div>
          {tab === "hist" ? <button style={{ padding:"7px 14px", border:`1px solid ${C.border}`, borderRadius:50, background:C.cream, fontSize:12, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Avaliar</button> : <span style={{ fontSize:18, color:C.textMuted }}>›</span>}
        </div>
      ))}
    </div>
  );
}

// ─── Profile ──────────────────────────────────────────────────────────
function ProfileScreen({ user, onLogout }) {
  const [loading, setLoading] = useState(false);
  const name = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "Usuário";
  const email = user?.email || "";
  const avatar = user?.user_metadata?.avatar_url;
  const doLogout = async () => { setLoading(true); await supabase.auth.signOut(); onLogout(); };
  return (
    <div className="page" style={{ paddingBottom:100 }}>
      <div className="pban" />
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginTop:-40, paddingBottom:16 }}>
        {avatar
          ? <img src={avatar} alt="" style={{ width:80, height:80, borderRadius:"50%", border:`3px solid ${C.white}`, objectFit:"cover" }} />
          : <div style={{ width:80, height:80, borderRadius:"50%", background:C.sageLight, border:`3px solid ${C.white}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:700, color:C.sageDark }}>{name[0]?.toUpperCase()}</div>
        }
        <h3 style={{ marginTop:10, fontSize:20, fontWeight:600 }}>{name}</h3>
        <p style={{ color:C.textMuted, fontSize:13 }}>{email}</p>
        <span className="badge" style={{ marginTop:8 }}>✅ Conta ativa</span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, padding:"0 20px 20px" }}>
        {[["24","Sessões",C.sage],["350","Pontos",C.terracotta]].map(([v,l,c]) => (
          <div key={l} style={{ textAlign:"center", background:C.cream, borderRadius:14, padding:16 }}>
            <div style={{ fontSize:28, fontWeight:700, color:c }}>{v}</div>
            <div style={{ fontSize:12, color:C.textMuted }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ padding:"0 20px 20px" }}>
        <div className="stitle">Pacotes Ativos</div>
        {[{n:"Pilates",u:8,t:10},{n:"Massagem",u:1,t:5}].map(p => (
          <div key={p.n} style={{ marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontWeight:500 }}>{p.n}</span>
              <span style={{ fontSize:13, color:C.textMuted }}>{p.u}/{p.t}</span>
            </div>
            <div className="prog"><div className="progf" style={{ width:`${(p.u/p.t)*100}%` }} /></div>
          </div>
        ))}
      </div>
      <div style={{ padding:"0 20px", display:"flex", flexDirection:"column", gap:12 }}>
        <button className="btn btn-o">🤝 Indicar Amigo</button>
        <button className="btn" style={{ background:"#FEF2F2", color:"#DC2626", border:"1px solid #FECACA", fontFamily:"'DM Sans',sans-serif" }} disabled={loading} onClick={doLogout}>
          {loading && <span className="spin" style={{ borderTopColor:"#DC2626", borderColor:"#FECACA" }} />}
          {loading ? "Saindo..." : "Sair da Conta"}
        </button>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const [screen, setScreen] = useState("main");
  const [tab, setTab] = useState("home");
  const [selSvc, setSelSvc] = useState(null);
  const [selPkg, setSelPkg] = useState(null);
  const [booking, setBooking] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Handle OAuth hash fragment (#access_token=...)
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setBooting(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) setBooting(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const go = s => setScreen(s);

  if (booting) return (
    <>
      <style>{css}</style>
      <div style={{ height:"100vh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16, background:C.cream }}>
        <div style={{ fontSize:48 }}>🌿</div>
        <div style={{ width:26, height:26, border:`2px solid ${C.sageLight}`, borderTopColor:C.sage, borderRadius:"50%", animation:"sp .7s linear infinite" }} />
      </div>
    </>
  );

  if (!user) return <><style>{css}</style><div className="app"><AuthScreen onAuth={setUser} /></div></>;

  const content = () => {
    if (screen === "detail" && selSvc) return <DetailScreen svc={selSvc} onBook={(s,p) => { setSelPkg(p); go("booking"); }} onBack={() => go("main")} />;
    if (screen === "booking") return <BookingScreen svc={selSvc} pkg={selPkg} onConfirm={b => { setBooking(b); go("payment"); }} onBack={() => go("detail")} />;
    if (screen === "payment") return <PaymentScreen booking={booking} onPay={() => { showToast("✅ Agendamento confirmado!"); setTab("appointments"); go("main"); }} onBack={() => go("booking")} />;
    if (tab === "appointments") return <AppointmentsScreen />;
    if (tab === "profile") return <ProfileScreen user={user} onLogout={() => setUser(null)} />;
    return <HomeScreen user={user} onSelect={s => { setSelSvc(s); go("detail"); }} />;
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {content()}
        {screen === "main" && (
          <nav className="bnav">
            {[["home","🏠","Início"],["search","🔍","Buscar"],["appointments","📅","Agenda"],["profile","👤","Perfil"]].map(([t,icon,lbl]) => (
              <button key={t} className={`ni ${tab===t?"on":""}`} onClick={() => { setTab(t); go("main"); }}>
                <span style={{ fontSize:20 }}>{icon}</span>{lbl}
              </button>
            ))}
          </nav>
        )}
        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
