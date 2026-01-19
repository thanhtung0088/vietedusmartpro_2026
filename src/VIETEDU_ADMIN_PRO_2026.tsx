import React, { useState, useEffect } from 'react';

const VIETEDU_ADMIN_OS_2026: React.FC = () => {
  // --- 1. QUẢN LÝ TRẠNG THÁI ---
  const [activeMainTab, setActiveMainTab] = useState('QUẢN TRỊ TRƯỜNG');
  const [activeSubTab, setActiveSubTab] = useState('NHÂN SỰ & TỔ CHỨC');
  const [activeOfficeModule, setActiveOfficeModule] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Trạng thái AI & Dữ liệu
  const [isAiRunning, setIsAiRunning] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [excelInput, setExcelInput] = useState('');
  const [personnelData, setPersonnelData] = useState<any[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('viedu_ns_2026_v3') : null;
      return saved ? JSON.parse(saved) : [
        { stt: 1, ma: "7904608247", name: "TRƯƠNG NGỌC BẢO ÂN", dob: "22/01/1989", mon: "Tin học" },
        { stt: 2, ma: "7904608248", name: "LÊ THỊ ANH", dob: "05/05/1990", mon: "Toán" }
      ];
    } catch (e) { return []; }
  });

  // --- 2. LOGIC XỬ LÝ ---
  const runAiTkb = () => {
    setIsAiRunning(true); setAiProgress(0);
    const interval = setInterval(() => {
      setAiProgress(p => { if (p >= 100) { clearInterval(interval); setIsAiRunning(false); return 100; } return p + 2; });
    }, 50);
  };

  const handleExcelPaste = () => {
    const lines = excelInput.split('\n').filter(l => l.trim());
    const newData = lines.map(line => {
      const c = line.split('\t');
      return { stt: c[0], ma: c[1], name: c[2], dob: c[3], mon: c[4] };
    }).filter(p => p.name);
    setPersonnelData(newData); setIsExcelModalOpen(false); setExcelInput('');
  };

  // --- 3. GIAO DIỆN PHÂN HỆ HÀNH CHÍNH ---
  const renderOfficeContent = () => {
    const modules = [
      { id: 'KT', name: 'Kế toán - Tài vụ', icon: 'fa-calculator', tags: ['Lập phiếu thu/chi', 'Bảng lương', 'Quyết toán thuế', 'Sổ quỹ'] },
      { id: 'HV', name: 'Học vụ - Văn thư', icon: 'fa-file-signature', tags: ['Quản lý hồ sơ HS', 'Công văn đi/đến', 'Sổ điểm', 'Học bạ điện tử'] },
      { id: 'IT', name: 'Công nghệ thông tin', icon: 'fa-laptop-code', tags: ['Quản trị Website', 'Hệ thống LMS', 'Sửa chữa thiết bị', 'Bảo mật'] },
      { id: 'TV', name: 'Thư viện', icon: 'fa-book-open', tags: ['Mượn/Trả sách', 'Danh mục sách mới', 'Thẻ thư viện', 'Thống kê'] },
      { id: 'TVHD', name: 'Tư vấn học đường', icon: 'fa-comments', tags: ['Lịch tư vấn', 'Hồ sơ tâm lý', 'Chuyên đề kỹ năng', 'Hộp thư bí mật'] },
      { id: 'DD', name: 'Đoàn - Đội', icon: 'fa-star', tags: ['Phong trào thi đua', 'Sổ chi đoàn', 'Kế hoạch nhỏ', 'Đại hội Đoàn/Đội'] },
      { id: 'BV', name: 'Bảo vệ - Phục vụ', icon: 'fa-shield-heart', tags: ['Trực cổng', 'Tuần tra đêm', 'Vệ sinh cảnh quan', 'Sửa chữa điện nước'] },
      { id: 'GT', name: 'Giám thị', icon: 'fa-user-clock', tags: ['Điểm danh HS', 'Vi phạm kỷ luật', 'Nề nếp tác phong', 'Liên lạc PH'] }
    ];

    if (activeOfficeModule) {
      const current = modules.find(m => m.name === activeOfficeModule);
      return (
        <div className="p-8 h-full animate-in slide-in-from-bottom-10 duration-500 flex flex-col">
          <button onClick={() => setActiveOfficeModule(null)} className="mb-6 text-[10px] font-black uppercase text-blue-600 flex items-center gap-2 hover:gap-4 transition-all">
            <i className="fa-solid fa-arrow-left"></i> Trở lại danh sách hành chính
          </button>
          <div className="bg-white rounded-[40px] shadow-2xl flex-1 flex flex-col overflow-hidden border border-blue-100">
            <div className="p-10 bg-slate-50 border-b flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-[#1e3a8a] text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                  <i className={`fa-solid ${current?.icon}`}></i>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#1e3a8a] uppercase italic">{current?.name}</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Không gian làm việc chuyên môn</p>
                </div>
              </div>
              <div className="flex gap-4">
                 <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase italic shadow-lg hover:bg-black transition-all">Xuất báo cáo</button>
                 <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase italic shadow-lg hover:bg-blue-600 transition-all">Lưu dữ liệu</button>
              </div>
            </div>
            <div className="p-10 grid grid-cols-4 gap-6">
              {current?.tags.map((tag, i) => (
                <div key={i} className="bg-white border-2 border-slate-50 p-8 rounded-[30px] hover:border-blue-500 hover:shadow-xl transition-all cursor-pointer group flex flex-col items-center text-center">
                   <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <i className="fa-solid fa-plus"></i>
                   </div>
                   <span className="text-[11px] font-black uppercase italic text-slate-700">{tag}</span>
                </div>
              ))}
              <div className="col-span-4 mt-10 border-t border-dashed pt-10 text-center opacity-20 italic font-black uppercase tracking-[0.3em]">
                 Hệ thống đã sẵn sàng cho {current?.name}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-10 grid grid-cols-4 gap-8 animate-in fade-in duration-700">
        {modules.map((m) => (
          <div key={m.id} onClick={() => setActiveOfficeModule(m.name)} className="group bg-white p-10 rounded-[45px] shadow-xl hover:shadow-2xl hover:bg-[#1e3a8a] transition-all cursor-pointer flex flex-col items-center text-center border border-slate-50 relative overflow-hidden">
             <div className="w-20 h-20 bg-blue-50 text-[#1e3a8a] rounded-3xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:bg-white/10 group-hover:text-white transition-all shadow-sm">
                <i className={`fa-solid ${m.icon}`}></i>
             </div>
             <h3 className="text-[13px] font-black text-slate-800 uppercase italic group-hover:text-white transition-colors">{m.name}</h3>
             <p className="text-[8px] font-bold text-slate-400 uppercase mt-4 tracking-widest group-hover:text-blue-300">Nhấp để mở</p>
          </div>
        ))}
      </div>
    );
  };

  // --- 4. RENDER TỔNG THỂ ---
  const renderMainContent = () => {
    if (activeSubTab === 'NHÂN SỰ & TỔ CHỨC') return (
      <div className="p-8 h-full flex flex-col">
        <div className="bg-white rounded-[40px] shadow-2xl flex-1 flex flex-col overflow-hidden border border-blue-100">
          <div className="p-8 bg-slate-50/80 border-b flex justify-between items-center">
            <div><h2 className="text-2xl font-black text-[#1e3a8a] uppercase italic">Nhân sự & Tổ chức</h2><p className="text-[10px] font-bold text-slate-400 uppercase italic">Danh sách 2025-2026</p></div>
            <button onClick={() => setIsExcelModalOpen(true)} className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase italic shadow-lg hover:bg-black transition-all"><i className="fa-solid fa-file-excel mr-2"></i> Nạp từ Excel</button>
          </div>
          <div className="flex-1 overflow-auto p-6 custom-scrollbar">
            <table className="w-full border-separate border-spacing-y-2">
              <thead className="sticky top-0 bg-[#1e3a8a] text-white text-[10px] uppercase italic"><tr><th className="p-5 text-center w-16 rounded-l-2xl">STT</th><th className="p-5 text-left">Mã định danh</th><th className="p-5 text-left">Họ tên giáo viên</th><th className="p-5 text-center">Ngày sinh</th><th className="p-5 text-left rounded-r-2xl">Môn dạy</th></tr></thead>
              <tbody className="text-[#1e3a8a]">
                {personnelData.map((p, i) => (
                  <tr key={i} className="bg-white border border-blue-50 hover:bg-blue-50 shadow-sm rounded-2xl">
                    <td className="p-5 text-center font-black opacity-30">{p.stt}</td><td className="p-5 font-mono text-[10px] text-slate-400">{p.ma}</td><td className="p-5 uppercase font-black text-[12px]">{p.name}</td><td className="p-5 text-center font-bold">{p.dob}</td><td className="p-5 italic text-[10px] truncate max-w-xs">{p.mon}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );

    if (activeSubTab === 'HÀNH CHÍNH VĂN PHÒNG') return renderOfficeContent();

    if (activeSubTab === 'SOẠN TKB AI') return (
      <div className="p-8 h-full">
        <div className="bg-[#0f172a] rounded-[50px] shadow-2xl h-full p-12 text-white relative overflow-hidden">
           <div className="relative z-10 flex justify-between items-start mb-16">
              <div><h2 className="text-4xl font-black uppercase italic text-blue-400">AI PLANNER 2026</h2><p className="text-[10px] font-bold text-slate-500 uppercase mt-2">Hệ thống tối ưu hóa v2.6</p></div>
              <div className="flex gap-4">
                <div className="bg-slate-800 p-4 rounded-2xl text-center"><p className="text-[8px] text-blue-400 uppercase">Ràng buộc</p><p className="text-xl font-black italic">142</p></div>
                <div className="bg-slate-800 p-4 rounded-2xl text-center"><p className="text-[8px] text-emerald-400 uppercase">Độ chính xác</p><p className="text-xl font-black italic">99.8%</p></div>
              </div>
           </div>
           <div className="relative z-10 flex flex-col items-center justify-center py-20">
              {isAiRunning ? (
                <div className="w-full max-w-xl text-center">
                  <div className="text-7xl font-black italic text-blue-400 mb-6">{aiProgress}%</div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500 shadow-[0_0_20px_#3b82f6]" style={{width: `${aiProgress}%`}}></div></div>
                </div>
              ) : (
                <button onClick={runAiTkb} className="bg-blue-600 hover:bg-white hover:text-blue-600 px-16 py-8 rounded-[35px] font-black uppercase italic text-lg shadow-2xl transition-all">BẮT ĐẦU SOẠN THẢO AI</button>
              )}
           </div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
        </div>
      </div>
    );

    return <div className="p-20 text-center opacity-10 text-4xl font-black uppercase italic tracking-widest">{activeSubTab}</div>;
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 overflow-hidden font-sans">
      {/* SIDEBAR CHÍNH */}
      <aside className="w-24 bg-[#061631] flex flex-col items-center py-10 shrink-0 z-50">
        <div className="w-14 h-14 bg-blue-600 rounded-[22px] flex items-center justify-center mb-16 shadow-xl"><i className="fa-solid fa-shield-halved text-white text-2xl"></i></div>
        <nav className="flex flex-col gap-10 text-slate-500">
           <i className={`fa-solid fa-table-columns text-xl cursor-pointer ${activeMainTab==='QUẢN TRỊ TRƯỜNG'?'text-blue-400':''}`} onClick={() => setActiveMainTab('QUẢN TRỊ TRƯỜNG')}></i>
           <i className="fa-solid fa-calendar-check text-xl cursor-pointer"></i>
           <i className="fa-solid fa-database text-xl cursor-pointer"></i>
        </nav>
      </aside>

      {/* SIDEBAR PHỤ */}
      {!isFullScreen && activeMainTab === 'QUẢN TRỊ TRƯỜNG' && (
        <aside className="w-80 bg-white border-r border-slate-100 flex flex-col shrink-0 z-40 animate-in slide-in-from-left-4 duration-500">
          <div className="p-10 border-b border-slate-50">
            <h1 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 italic">Bình Hòa Hub</h1>
            <p className="text-xl font-black text-slate-800 uppercase italic">Administration</p>
          </div>
          <nav className="flex-1 p-5 space-y-1 overflow-y-auto custom-scrollbar">
            {[
              { n: 'NHÂN SỰ & TỔ CHỨC', i: 'fa-users-gear' },
              { n: 'HÀNH CHÍNH VĂN PHÒNG', i: 'fa-building' },
              { n: 'CHI BỘ', i: 'fa-flag' },
              { n: 'CÔNG ĐOÀN', i: 'fa-handshake' },
              { n: 'QUẢN LÝ TÀI CHÍNH', i: 'fa-money-check-dollar' },
              { n: 'QUẢN LÝ CHUYÊN MÔN', i: 'fa-book' },
              { n: 'QUẢN LÝ CƠ SỞ VẬT CHẤT', i: 'fa-couch' },
              { n: 'BÁO CÁO TỔNG HỢP', i: 'fa-chart-pie' },
              { n: 'SOẠN TKB AI', i: 'fa-microchip' }
            ].map(m => (
              <button key={m.n} onClick={() => { setActiveSubTab(m.n); setActiveOfficeModule(null); }} className={`w-full flex items-center gap-4 px-6 py-5 rounded-[22px] text-[10px] font-black uppercase italic transition-all ${activeSubTab === m.n ? 'bg-[#1e3a8a] text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}>
                <i className={`fa-solid ${m.i} w-5`}></i> {m.n}
              </button>
            ))}
          </nav>
        </aside>
      )}

      {/* NỘI DUNG */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden">
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-12 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsFullScreen(!isFullScreen)} className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-black transition-all"><i className={`fa-solid ${isFullScreen ? 'fa-compress' : 'fa-expand'}`}></i></button>
            <div className="flex flex-col"><span className="text-[9px] font-black text-blue-500 uppercase italic">{activeMainTab}</span><h2 className="text-[14px] font-black text-slate-900 uppercase italic tracking-wider">{activeSubTab}</h2></div>
          </div>
          <div className="flex items-center gap-4 text-right">
             <div><p className="text-[10px] font-black uppercase italic">Thầy Tùng Admin</p><p className="text-[8px] font-bold text-emerald-500 uppercase">Hệ thống online</p></div>
             <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-white shadow-lg"><i className="fa-solid fa-user-tie"></i></div>
          </div>
        </header>
        <section className="flex-1 overflow-auto bg-[#f8fafc]/50 relative custom-scrollbar">
           {renderMainContent()}
        </section>

        {/* MODAL EXCEL */}
        {isExcelModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-3xl rounded-[50px] p-12 shadow-2xl border-t-[10px] border-emerald-500 animate-in zoom-in-95">
               <h3 className="text-3xl font-black uppercase italic mb-8">Nạp dữ liệu từ Excel</h3>
               <textarea value={excelInput} onChange={(e) => setExcelInput(e.target.value)} placeholder="Dán 5 cột từ Excel vào đây..." className="w-full h-80 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[30px] p-8 text-[12px] font-bold outline-none focus:border-emerald-500 transition-all shadow-inner" />
               <div className="flex gap-4 mt-10">
                  <button onClick={() => setIsExcelModalOpen(false)} className="flex-1 bg-slate-100 text-slate-400 py-6 rounded-3xl font-black uppercase italic text-[10px]">Hủy bỏ</button>
                  <button onClick={handleExcelPaste} className="flex-2 bg-emerald-500 text-white px-16 py-6 rounded-3xl font-black uppercase italic text-[10px] shadow-xl shadow-emerald-200">Xác nhận nạp</button>
               </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 20px; }
      `}</style>
    </div>
  );
};

export default VIETEDU_ADMIN_OS_2026;