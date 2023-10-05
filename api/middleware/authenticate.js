import  jwt  from "jsonwebtoken";
const SECRET_KEY = process.env.SECRET_KEY;

function authenticate(req,res,next){
    const token = req.headers.authorization

    if(!token){
        return res.status(401).json({
            message : "Invalid authenticate",
        });
    }
    console.log("TOKEN" , token)

    const tokenWithoutBearer = token.split(" ")[1];
    
    jwt.verify(tokenWithoutBearer,SECRET_KEY,(error, decoded) =>{
        if(error){
            return res.status(401).json({
                message: "Invalid Token"
            });
        }

        // back the right token
        req.decoded = decoded;

        // go to the next  
        next();


    });
}

export default authenticate;