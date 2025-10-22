const ACCESS_KEY = 'hyperAuth';
const ACCESS_CODE = '21042025';

// Gọi ở trang cổng: thử unlock (đúng -> set sessionStorage)
function tryUnlock(code){
  if(code === ACCESS_CODE){
    sessionStorage.setItem(ACCESS_KEY, 'ok');
    return true;
  }
  return false;
}

// Gọi ở tất cả trang nội bộ (dashboard, lesson...): chặn truy cập trực tiếp
(function guard(){
  const isGate = location.pathname.endsWith('/index.html') || location.pathname.endsWith('/') || location.pathname === '/';
  if(isGate) return; // Trang cổng không cần guard

  // Nếu chưa có session => về cổng
  if(sessionStorage.getItem(ACCESS_KEY) !== 'ok'){
    window.location.href = '../index.html'.replace('../',''); // an toàn cho cả root & subdir
  }
})();
