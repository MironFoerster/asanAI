import { HttpInterceptorFn } from '@angular/common/http';

const apiBaseUrl = "http://127.0.0.1:8000/"//"https://site--toasterapi--2vd4knhkkhn9.code.run/"; //  "http://192.168.2.106:8000/"; // "http://127.0.0.1:8000/"; //


export const urlInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.headers.get('X-ApiRequest') === 'true') {
    console.log("with header")
    const apiRequest = req.clone({ url: `${apiBaseUrl}${req.url}` });
    return next(apiRequest);
  } else {
    console.log("no header")
    return next(req);
  }
};



