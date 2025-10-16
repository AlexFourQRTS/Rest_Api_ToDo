export class RequestHelper {
  static getClientIP(req: any): string {
    const forwardedHeader = req.headers['x-forwarded-for'];
    const realIPHeader = req.headers['x-real-ip'];
    
    if (typeof forwardedHeader === 'string') {
      return forwardedHeader.split(',')[0].trim();
    }
    
    if (typeof realIPHeader === 'string') {
      return realIPHeader;
    }
    
    return req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
  }
}
