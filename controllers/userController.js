
const User = require("../models/User");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const generateToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            name: user.name,
            role: user.role, 
        } // payload
        ,process.env.JWT_SECRET,
         // secret key
    )
}


const Login= async(req,res)=>{
    const {username,password}=req.body;

    try{
      console.log("Login request received:", req.body);

        const user =await User.findOne({username});
        if(!user)
            res.status(401).json({message:"Invalid credentials"});

        const isMatch= await bycrypt.compare(password,user.password);
        if(!isMatch)
            res.status(401).json({message:"Invalid Credentials"});

        const token = generateToken(user);

        res.status(200).json({token , user,message:"user LogIn successfully"});

    }catch(err){
      console.log(err)
        res.status(500).json({message:"Server error"});

    }
}

const addUser = async (req,res)=>{
    const newuser = req.body;
    try{
        const hashedPassword = await bycrypt.hash(newuser.password,10);
        newuser.password=hashedPassword;
        const user = new User(newuser);
        await user.save();

  res.status(200).json({
      user: {
        username: newuser.username,
        role: newuser.role,
      },
      message: "User Created",
    });    }catch(err){
    res.status(500).json({message:"Server error"});

    }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({users , message:"Usere Fetched Successfully"});
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    console.log(req.params.id);
    const user = await User.findById(req.params.id).select("-password");
    console.log(user)
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({user , message:"User Fetched Successfully"});
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const updatedData = { username, role };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports={
    Login,
    addUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
}