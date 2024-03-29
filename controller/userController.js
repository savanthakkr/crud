const db = require('../config/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middleware/auth');
const path = require('path');
const { error } = require('console');
const fs = require('fs');



const generateToken = (userData) => {
    return jwt.sign({ id: userData.id, email: userData.email }, 'crud', { expiresIn: '24h' });
};



//SELECT u.*, d.department_Name FROM userdata u JOIN department d ON u.departmentId = d.id
//SELECT * FROM userdata WHERE is_deleted=0

//get all users
const getAllUsers = async (req, res) => {
    try {
        const data = await db.query('SELECT u.*, d.department_name FROM userdata u JOIN department d ON u.departmentId = d.id WHERE deleted_at IS NULL')
        if (!data) {
            return res.status(404).send({
                message: 'no records found'
            })
        }
        res.status(200).send({
            message: "data fetched",
            data: data[0]
        })
    } catch (error) {
        console.log(error)
        res.send({
            message: 'Error in getAllUSer API',
            error
        })
    }
}


//get users by id
const getUsersById = async (req, res) => {
    try {
        const userid = req.params.id
        if (!userid) {
            return res.status(404).send({
                message: 'invalid id!'
            })
        }

        const data = await db.query(`SELECT * FROM userdata WHERE id=?`, [userid])
        if (!data) {
            return res.status(404).send({
                message: 'no record found!'
            })
        }
        res.status(200).send({
            userdata: data[0]
        })
    }
    catch (error) {
        console.log(error)
        res.send({
            message: 'Error in ID api',
            error
        })

    }
}

//add user

const addUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, gender, hobbies, departmentId } = req.body

        if (!firstName || !lastName || !email || !password || !gender || !hobbies || !departmentId) {
            return res.status(500).send({
                message: 'add all fields'
            })
        }

        //check for existing email in databse
        const [existingEmail] = await db.query('SELECT * FROM userdata WHERE email = ?', [email]);
        if (existingEmail.length > 0) {
            return res.status(409).send({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const data = await db.query(`INSERT INTO userdata (firstName,lastName,email,password,gender,hobbies,departmentId) VALUES (?,?,?,?,?,?,?)`, [firstName, lastName, email, hashedPassword, gender, hobbies, departmentId])

        if (!data) {
            return res.status(404).send({
                message: 'error in INSERT query'
            })
        }

        res.status(201).send({
            message: 'record created!'
        })


    } catch (error) {
        console.log(error)
        res.send({
            message: 'error in addUser api!'
        })
    }
}

//update user by id

const updateUser = async (req, res) => {
    try {

        const userId = req.params.id
        if (!userId) {
            return res.status(404).send({
                message: 'invalid id'
            })
        }

        const { firstName, lastName, email, password, gender, hobbies, departmentId } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        //check for existing email id
        const [existingEmail] = await db.query('SELECT * FROM userdata WHERE email = ?', [email]);
        if (existingEmail.length > 0) {
            return res.status(409).send({ message: 'Email already exists' });
        }

        const data = db.query("UPDATE userdata SET firstName = ?, lastName = ?, email = ?, password = ?, gender = ?, hobbies = ?, departmentId = ? WHERE id = ?", [firstName, lastName, email, hashedPassword, gender, hobbies, departmentId, userId])

        if (!data) {
            return res.status(500).send({
                message: 'error in update data'
            })
        }
        res.status(200).send({
            message: 'data updated!'
        })

    } catch (error) {
        console.log(error)
        res.send({
            message: 'error in addUser api!'
        })

    }
}

//delete user by id

const deleteUser = async (req, res) => {
    try {
      const userId = req.params.id;
      if (!userId) {
        return res.status(404).send({
          message: 'invalid id'
        });
      }
  
      // Set the `deleted_at` column to the current date and time
      await db.query(`UPDATE userdata SET deleted_at = NOW() WHERE id = ?`, [userId]);
  
      res.send(200).send({
        message: 'soft deletes user!'
      });
  
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: 'error in delete API'
      });
    }
  }
//get all users by department id

const getUsersByDepartmentId = async (req, res) => {

    try {
        const departmentId = req.params.id
        if (!departmentId) {
            return res.status(404).send({
                message: 'invalid id!'
            })
        }

        const data = await db.query(`SELECT * FROM userdata WHERE departmentId= ${departmentId}`)
        if (!data) {
            return res.status(404).send({
                message: 'no record found!'
            })
        }
        res.status(200).send({
            userdata: data[0]
        })
    }
    catch (error) {
        console.log(error)
        res.send({
            message: 'Error in dept ID api',
            error
        })

    }
}

//login check, email and password check

const checkLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [existingUser] = await db.query('SELECT * FROM userdata WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            const user = existingUser[0];
            // Compare password
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                const token = generateToken(user);
                return res.status(200).send({ message: 'Login success!', token: token });
            } else {
                return res.status(401).send({ message: 'Incorrect password!' });
            }
        } else {
            return res.status(404).send({ message: 'Email not found! Sign up!' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Error in login check api!',
            error
        });
    }
};

//file upload
// const uploadFile = async (req, res) => {
//     try {
//         console.log(req.files)


//         let image = req.files.image //key and auth
//         if(image.length>1){
//             throw new error('multiple file not allowed')
//         }
//         if (image == undefined || image == null) throw new Error("file note found");
//         let savePath = `/public/assets/${Date.now()}.${image.name.split(".").pop()}`
//         image.mv(path.join(__dirname, ".." + savePath), async (err) => {
//             if (err) throw new Error("error in uploading")
//             else {
//                 const updateQuery = 'UPDATE userdata SET profile_picture = ? WHERE id = ?'
//                 await db.query(updateQuery, [savePath, req.user.id]);
//                 res.status(201).send({
//                     message: 'file uploaded!'
//                 })
//             }
//         });

       

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: 'error in file upload api!' });
//     }
// };



const uploadFile = async (req, res) => {
    try {
        console.log(req.files)

        if (!req.files || !req.files.image) {
            throw new Error("file not found");
        }

        const image = req.files.image;
        if (image.length > 1) {
            throw new Error('multiple file not allowed');
        }

        const dirExists = fs.existsSync('public/assets');
        if (!dirExists) {
            fs.mkdirSync('public/assets', { recursive: true });
        }

        const ext = image.name.split('.').pop();
        const savePath = `/public/assets/${Date.now()}.${ext}`;

        image.mv(path.join(__dirname, "..", savePath), async (err) => {
            if (err) {
                throw new Error("error in uploading");
            }
            const updateQuery = 'UPDATE userdata SET profile_picture = ? WHERE id = ?';
            await db.query(updateQuery, [savePath, req.user.id]);
            res.status(201).send({
                message: 'file uploaded!'
            });
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'error in file upload api!' });
    }
};




module.exports = { getAllUsers, getUsersById, addUser, updateUser, deleteUser, getUsersByDepartmentId, checkLogin, uploadFile };



 // Get user ID from JWT token 
        // const userId = req.body.userId; 

        // if (!userId) {
        //     return res.status(400).json({ message: 'User ID is required!' });
        // }

        // const filename = req.file.filename;

        // // Update database with the filename
        // const updateQuery = 'UPDATE users SET profile_picture = ? WHERE id = ?';
        // await db.query(updateQuery, [filename, userId]);

        // res.status(200).json({ message: 'File uploaded successfully!', filename: filename });