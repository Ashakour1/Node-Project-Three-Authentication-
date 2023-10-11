import express from 'express';
import prisma from './lib/index.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY;

// sign up 

router.post("/signup", async (req,res) => {

  const {name,email,password} = req.body;

  try{
    const existingAuthor = await prisma.author.findUnique({ 
      where: {
         email: email
       },
    });


    // checking 

    if(existingAuthor){

      return res.status(400).json({message: "Author already exists"
    
    });

    }

    // hash password 

    // 10 means make 10 times hash
  const hashPassword = await bcrypt.hash(password,10);
    // create the author
  const newAuthor = await prisma.author.create({
    data : {
      name : name,
      email: email,
      password : hashPassword,
    },
  });

  return res.status(200).json({
    message : "Author Created SuccessFully",
    author : newAuthor,
  });




    
  }catch(error){
    res.status(500).json({message : "Something Went Wrong ",
  error : error.message
});

  }
})

//  log in

router.post("/login", async(req,res) =>{

  const {email,password} = req.body;

  try{
    const existingAuthor = await prisma.author.findUnique({
      where:{
        email : email,
      },
    });

    if(!existingAuthor){
      res.status(404).json({
        message : "Author Does not exist",
      });
    }

    // check password

    const ispasswordCorrect = await bcrypt.compare(password,existingAuthor.password)

    if(!ispasswordCorrect){
      res.status(401).json({
        message  : "Incorrect Password"
      });
    }

    // create token

    const token = jwt.sign({
      id : existingAuthor.id, 
      email : existingAuthor.email,
    },
    SECRET_KEY,
    {expiresIn :"2h"}
    )

    return res.status(200).json({
      message : "logged in successfully",
      token : token,
    })
    
  }catch(error){
    res.status(500).json({
      message : "Something Went Wrong",
      error : error.message,
    })

  }
})


export default router;