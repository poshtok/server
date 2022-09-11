import {Request,Response,NextFunction} from "express"
function paginate(model:any, page:any, limit:any) {
    if (typeof model === "function") {
      return async (req:Request, res:Response, next:NextFunction) => {
        const page = req.query.page
          ? parseInt((req as any).query.page)
          : ((req as any).query.page = 1);
        const limit = req.query.limit
          ? parseInt(( req as any).query.limit)
          : ((req as any).query.limit = 3);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
  
        const result = {};
  
        if (endIndex < (await model.countDocuments().exec())) {
          (result as any).next = {
            page: page + 1,
            limit: limit,
          };
        }
        if (startIndex > 0) {
          (result as any).previous = {
            page: page - 1,
            limit: limit,
          };
        }
        try {
          (result as any).results = await model.find().limit(limit).skip(startIndex);
          (res as any).paginatedResult = result;
          next();
        } catch (e:any) {
          res.status(500).json({ message: e.message });
        }
      };
    } else if (Array.isArray(model)) {
      page = page ? parseInt(page) : (page = 1);
      limit = limit ? parseInt(limit) : (limit = 3);
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
  
      const result = {};
  
      if (endIndex < model.length) {
        (result as any).next = {
          page: page + 1,
          limit: limit,
        };
      }
      if (startIndex > 0) {
        (result as any).previous = {
          page: page - 1,
          limit: limit,
        };
      }
      (result as any).results = model.slice(startIndex, endIndex);
      return result;
    } else {
      if (!Array.isArray(model) || typeof model === "function") {
        return {
          Error: `Expected array or mongoose model  but got ${typeof model}`,
        };
      }
    }
  }
  export default  paginate