declare global {
  namespace Express {
    interface Request {
      userData: {
  		  id: number;
  		  username: string;
  		};
    }
  }
}

export {};
