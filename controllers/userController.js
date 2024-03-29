const db = require('../config/db')
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');



const generateToken = (userData) => {
    return jwt.sign({ id: userData.id, email: userData.email }, 'crud', { expiresIn: '24h' });
};




//get all users
const getAllAuthorUsers = async (req, res) => {
    try {
        const data = await db.query('SELECT * FROM author')
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

const getAllBooksUsers = async (req, res) => {
    try {
        const data = await db.query('SELECT * FROM book')
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

const getAllGenreUsers = async (req, res) => {
    try {
        const data = await db.query('SELECT * FROM genre')
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

//add user auther table

const addUserAuthor = async (req, res) => {
    try {
        const { author_name, biography, genre } = req.body

        if (!author_name || !biography || !genre  ) {
            return res.status(500).send({
                message: 'add all fields'
            })
        }

        //check for existing email in databse
        // const [existingEmail] = await db.query('SELECT * FROM userdata WHERE email = ?', [email]);
        // if (existingEmail.length > 0) {
        //     return res.status(409).send({ message: 'Email already exists' });
        // }


        const data = await db.query(`INSERT INTO author (author_name,biography,genre) VALUES (?,?,?)`, [author_name, biography, genre])

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


//add user auther table

const addUserBook = async (req, res) => {
    try {
        const { title, description, published_year, quantity_available, author_id, genre_id } = req.body

        if (!title || !description || !published_year || !quantity_available || !author_id || !genre_id  ) {
            return res.status(500).send({
                message: 'add all fields'
            })
        }

        //check for existing email in databse
        // const [existingEmail] = await db.query('SELECT * FROM userdata WHERE email = ?', [email]);
        // if (existingEmail.length > 0) {
        //     return res.status(409).send({ message: 'Email already exists' });
        // }


        const data = await db.query(`INSERT INTO book (title,description,published_year,quantity_available,author_id,genre_id) VALUES (?,?,?,?,?,?)`, [title, description, published_year,quantity_available,author_id,genre_id])

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


//add user auther table

const addUserGener = async (req, res) => {
    try {
        const { book_id, name } = req.body

        if (!book_id || !name   ) {
            return res.status(500).send({
                message: 'add all fields'
            })
        }

        //check for existing email in databse
        // const [existingEmail] = await db.query('SELECT * FROM userdata WHERE email = ?', [email]);
        // if (existingEmail.length > 0) {
        //     return res.status(409).send({ message: 'Email already exists' });
        // }


        const data = await db.query(`INSERT INTO genre (book_id,name,genre) VALUES (?,?)`, [book_id, name])

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

const updateUserBook = async (req, res) => {
    try {

        const bookid = req.params.id
        if (!bookid) {
            return res.status(404).send({
                message: 'invalid id'
            })
        }

        const {title, description, published_year, quantity_available, author_id, genre_id } = req.body

        //check for existing email id
        // const [existingbookid] = await db.query('SELECT * FROM userdata WHERE book_id = ?', [book_id]);
        // if (existingbookid.length > 0) {
        //     return res.status(409).send({ message: 'Email already exists' });
        // }

        const data = db.query("UPDATE book SET title = ?, description = ?, published_year = ?, quantity_available = ?, author_id = ?, genre_id = ? WHERE book_id = ?", [title, description, published_year,quantity_available,author_id,genre_id])

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

const updateUserAuthor = async (req, res) => {
    try {

        const bookid = req.params.book_id
        if (!bookid) {
            return res.status(404).send({
                message: 'invalid id'
            })
        }

        const {book_id, title, description, published_year, quantity_available, author_id, genre_id } = req.body

        //check for existing email id
        // const [existingbookid] = await db.query('SELECT * FROM userdata WHERE book_id = ?', [book_id]);
        // if (existingbookid.length > 0) {
        //     return res.status(409).send({ message: 'Email already exists' });
        // }

        const data = db.query("UPDATE book SET title = ?, description = ?, published_year = ?, quantity_available = ?, author_id = ?, genre_id = ? WHERE book_id = ?", [title, description, published_year,quantity_available,author_id,genre_id, book_id])

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

const updateUserGener = async (req, res) => {
    try {

        const bookid = req.params.book_id
        if (!bookid) {
            return res.status(404).send({
                message: 'invalid id'
            })
        }

        const {book_id, title, description, published_year, quantity_available, author_id, genre_id } = req.body

        //check for existing email id
        // const [existingbookid] = await db.query('SELECT * FROM userdata WHERE book_id = ?', [book_id]);
        // if (existingbookid.length > 0) {
        //     return res.status(409).send({ message: 'Email already exists' });
        // }

        const data = db.query("UPDATE book SET title = ?, description = ?, published_year = ?, quantity_available = ?, author_id = ?, genre_id = ? WHERE book_id = ?", [title, description, published_year,quantity_available,author_id,genre_id, book_id])

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








// const uploadFile = async (req, res) => {
//     try {
//         console.log(req.files)

//         if (!req.files || !req.files.image) {
//             throw new Error("file not found");
//         }

//         const image = req.files.image;
//         if (image.length > 1) {
//             throw new Error('multiple file not allowed');
//         }

//         const dirExists = fs.existsSync('public/assets');
//         if (!dirExists) {
//             fs.mkdirSync('public/assets', { recursive: true });
//         }

//         const ext = image.name.split('.').pop();
//         const savePath = `/public/assets/${Date.now()}.${ext}`;

//         image.mv(path.join(__dirname, "..", savePath), async (err) => {
//             if (err) {
//                 throw new Error("error in uploading");
//             }
//             const updateQuery = 'UPDATE userdata SET profile_picture = ? WHERE id = ?';
//             await db.query(updateQuery, [savePath, req.user.id]);
//             res.status(201).send({
//                 message: 'file uploaded!'
//             });
//         });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: 'error in file upload api!' });
//     }
// };




module.exports = { getAllAuthorUsers,getAllBooksUsers, getAllGenreUsers, getUsersById, addUserAuthor, addUserBook, addUserGener, updateUserBook, updateUserAuthor, updateUserGener, deleteUser, getUsersByDepartmentId };


