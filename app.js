const express = require("express");
const md5 = require("md5");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const mongoose = require("mongoose");
const { json } = require("body-parser");
const internal = require("stream");
const app = express();

const PORT = 3000;
const COOKIE_SECRET = "COOKIE_SECRET_PASSWORD_12345";

app.use(express.static("static"));
app.use(cookieParser(COOKIE_SECRET));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// mongoose.connect("mongodb://127.0.0.1:27017/NetworksUserDB", { useNewUrlParser: true });    //change to myDB
mongoose.connect("mongodb://127.0.0.1:27017/myDB", { useNewUrlParser: true });    //changed to myDB

const destinationSchema = mongoose.Schema({
    _id: {
        type: Number,
        required: [true,"Hat id!"]
    },
    category: {
        type: String,
        required: [true, "category is required"]
    },
    destinationName: {
        type: String,
        required: [true, "destination name is required"]
    },
    description: {
        type: String,
        required: [true, "description is"]
    },
    videoLink: {
        type: String,
        required: [true, "video link is required"]
    }
});

const networksUserSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"]
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    sessionID: {
        type: String,
        required: false
    },
    destination: {
        type: [destinationSchema],
        required: false
    }
},{ collection: 'myCollection' });

// const Destination = mongoose.model("Destination", destinationSchema);
const destinations = [
    {
        _id: 1,
        category: 'Beaches',
        destinationName: 'Marassi',
        description: 'Marassi North Coast is considered one of the most famous beaches of Egypt',
        videoLink: 'https://www.youtube.com/embed/h2kjPiSpjAE'
    },
    {
        _id: 2,
        category: 'Beaches',
        destinationName: 'Ain El Sokhna',
        description: 'feeha shamsss',
        videoLink: 'https://www.youtube.com/embed/nT4K-9C34tU'
    },
    {
        _id: 3,
        category: 'History',
        destinationName: 'Pyramids of Giza',
        description: 'The three Pyramids of Giza were built as tombs by three Pharaohs of ancient Egypt',
        videoLink: 'https://www.youtube.com/embed/lJKX3Y7Vqvs'
    },
    {
        _id: 4,
        category: 'Mountains',
        destinationName: 'Mount Everest',
        description: 'Mount Everest is Earth\'s highest mountain above sea level',
        videoLink: 'https://www.youtube.com/embed/aFkC7Cd9-IE'
    },
    {
        _id: 5,
        category: 'Hotels',
        destinationName: 'JW Marriot',
        description: 'An upscale, modern 5-star hotel in Cairo',
        videoLink: 'https://www.youtube.com/embed/vxbDYixWMVw'
    },
    {
        _id: 6,
        category: 'Museums',
        destinationName: 'Grand Egyptian Museum',
        description: 'Museum, ancient egypt and ancient history',
        videoLink: 'https://www.youtube.com/embed/dwdhs6kRDY8'
    },
    {
        _id: 7,
        category: 'History',
        destinationName: 'Abu Simbel Temples',
        description: 'Massive monument from 13th-century BC',
        videoLink: 'https://www.youtube.com/embed/67xGeUnS0GA'
    },
    {
        _id: 8,
        category: 'History',
        destinationName: 'Karnak Temples',
        description: 'Vast iconic complex of temple ruins',
        videoLink: 'https://www.youtube.com/embed/jy0_avdgCM4'
    },
    {
        _id: 9,
        category: 'Museums',
        destinationName: 'Royal Jewelry Museum',
        description: 'Collections from Muhammad Ali dynasty',
        videoLink: 'https://www.youtube.com/embed/JzxbZvqoIKE'
    },
    {
        _id: 10,
        category: 'Museums',
        destinationName: 'Bibliotheca Alexandrina',
        description: 'Landmark contemporary library complex',
        videoLink: 'https://www.youtube.com/embed/nbVShDVXtAM'
    },
    {
        _id: 11,
        category: 'Parks',
        destinationName: 'Dream Park',
        description: 'Popular destination with games & rides',
        videoLink: 'https://www.youtube.com/embed/UJ1M8P7RJH0'
    },
    {
        _id: 12,
        category: 'Parks',
        destinationName: 'Makadi Bay Aqua Park',
        description: 'Waterpark for adults & children',
        videoLink: 'https://www.youtube.com/embed/BQHGWeo3KpQ'
    },
    {
        _id: 13,
        category: 'Parks',
        destinationName: 'Al-Azhar Park',
        description: 'Landscaped gardens with city views',
        videoLink: 'https://www.youtube.com/embed/iwWxDsDoOFc'
    },
    {
        _id: 14,
        category: 'History',
        destinationName: 'Valley of the Kings',
        description: 'Pharaohs\' tombs & burial chambers',
        videoLink: 'https://www.youtube.com/embed/AeM74XzJrN0'
    },
    {
        _id: 15,
        category: 'Hotels',
        destinationName: 'Dusit Thani Lakeview',
        description: 'A High-end, Thai-themed 5-star hotel in New Cairo',
        videoLink: 'https://www.youtube.com/embed/WfyR7qIxvzQ'
    },
    {
        _id: 16,
        category: 'Mountains',
        destinationName: 'Mount Catherine',
        description: 'Mountain associated with Saint Catherine',
        videoLink: 'https://www.youtube.com/embed/C1Sokdxhrps'
    },
];

// array of categories
var categories = [];
for (var i = 0; i < destinations.length; i++) {
    if (!(categories.includes(destinations[i].category))) {
        categories.push(destinations[i].category);
    }
}
// number of destinations per category
var categoryDestCount = new Array(categories.length).fill(0);
for (let i = 0; i < categories.length; i++) {
    for (let j = 0; j < destinations.length; j++) {
        if (destinations[j].category == categories[i]) {
            categoryDestCount[i]++;
        }
    }
}





// const NetworksUser = new mongoose.model("NetworksUser", networksUserSchema);    
const NetworksUser = new mongoose.model("myCollection", networksUserSchema);    //changed to myCollection

app.route("/")
    .get(function (request, response) {
        var cookie = request.cookies.sessionID;
        if (cookie) {
            NetworksUser.findOne({ sessionID: cookie }, function (err, user) {
                if (!err) {
                    // categories and categoryDestCount are precomputed!

                    if (!err) {
                        return response.render("home_page", { user: user, categories: categories, catN: categoryDestCount, errorMessage: "" });
                    }
                } else {
                    return response.redirect("/login");
                }
            })
        } else {
            return response.redirect("/login");
        }
    });

app.route("/login")
    .get(function (request, response) {
        var cookie = request.cookies.sessionID;
        if (cookie) {
            return response.redirect("/");
        } else {
            return response.render("login", { errorMessage: "" });
        }
    })
    .post(function (request, response) {
        const username = request.body.username;
        const hashedPassword = md5(request.body.password);

        //ADMIN LOGIN
        if (username == "admin" && request.body.password == "admin") {
            console.log("Loggin in as admin")
            var nextCookie = crypto.randomBytes(32).toString("base64");
            response.cookie("sessionID", nextCookie);
            return response.redirect("/");
        }

        NetworksUser.findOne({ username: username }, function (err, user) {
            if (!user) {
                return response.render("login", { errorMessage: "This user does not exist" });
            } else {
                if (hashedPassword !== user.password) {
                    return response.render("login", { errorMessage: "Username/Password incorrect" });
                } else {
                    var nextCookie = crypto.randomBytes(32).toString("base64");
                    NetworksUser.updateOne({ username: username }, { $set: { sessionID: nextCookie } }, function (err) {
                        if (!err) {
                            response.cookie("sessionID", nextCookie);
                            return response.redirect("/");
                        }
                    })
                }
            }
        })
    });

app.route("/register")
    .get(function (request, response) {
        return response.render("register", { errorMessage: "" });
    })
    .post(function (request, response) {
        const username = request.body.username;
        const password = request.body.password;

        NetworksUser.findOne({ username: username }, function (err, user) {
            if (user) {
                return response.render("register", { errorMessage: "Username already taken" });
            } else {
                if (password.trim().length == 0) {
                    return response.render("register", { errorMessage: "Password cannot be empty" });
                }

                const hashedPassword = md5(password);

                var sessionID = crypto.randomBytes(32).toString("base64");
                var user = new NetworksUser({
                    username: username,
                    password: hashedPassword,
                    sessionID: sessionID,
                });

                user.save(function (err) {
                    if (!err) {
                        // response.cookie("sessionID", sessionID);
                        return response.render("login", { errorMessage: "Your account was created successfully!" });
                    } else {
                        return response.render("/register", { errorMessage: "Something went wrong, try again" });
                    }
                })
            }
        })

    });

app.route("/logout")
    .post(function (request, response) {
        var cookie = request.cookies.sessionID;
        NetworksUser.updateOne({ sessionID: cookie }, { $set: { sessionID: "" } }, function (err) {
            if (!err) {
                response.clearCookie("sessionID");
                return response.redirect("/login");
            } else {
                return response.redirect("/");
            }
        });
    });

app.route("/home/:category")
    .get(function (request, response) {
        const categoryRoute = request.params.category;
        const cookie = request.cookies.sessionID;
        const destinationNames = [];
        const userDestinationNames = [];
        const availableButtons = [];
        const validDests = [];
        // Destination.find({ category: categoryRoute }, function (err, destinations) {
        // for (let i = 0; i < destinations.length; i++) {
        //     destinationNames.push(destinations[i].destinationName);
        //     categoryNames.push(destinations[i].category);
        // }

        if (categories.includes(categoryRoute)) {
            NetworksUser.findOne({ sessionID: cookie }, function (err, user) {
                const userDests = user?user.destination:[];
                if (!err) {
                    for (let i = 0; i < userDests.length; i++) {
                        userDestinationNames.push(userDests[i].destinationName);
                    }
                    for (let i = 0; i < destinations.length; i++) {
                        if (destinations[i].category == categoryRoute) {
                            destinationNames.push(destinations[i].destinationName);
                            validDests.push(destinations[i]);
                        }
                    }
                    for (let i = 0; i < destinationNames.length; i++) {
                        if (userDestinationNames.includes(destinationNames[i])) {
                            availableButtons.push(0);
                        } else {
                            availableButtons.push(1);
                        }
                    }
                    return response.render("category_page", { user: user, category: categoryRoute, destinations: validDests, available: availableButtons });
                }
            })
        } else {
            return response.render('error404');
        }

    }
        // })
    )
// .post(function (request, response) {
//     const username = request.body.username;
//     const searchText = request.body.searchText.toLowerCase();
//     const destNames = [];
//     const validDest = [];
//     const cookie = request.cookies.sessionID;
//     const categoryRoute = request.params.category;
//     const userDestinationNames = [];
//     const availableButtons = [];

//     for (let i = 0; i < destinations.length; i++) {
//         destNames.push(destinations[i].destinationName.toLowerCase());
//     }

//     for (let i = 0; i < destNames.length; i++) {
//         if (destNames[i].includes(searchText)) {
//             if (destinations[i].category == categoryRoute) {
//                 validDest.push(destinations[i]);
//             }
//         }
//     }
//     NetworksUser.findOne({ sessionID: cookie }, function (err, user) {
//         if (!err) {
//             for (let i = 0; i < user.destination.length; i++) {
//                 userDestinationNames.push(user.destination[i].destinationName);
//             }
//             for (let i = 0; i < validDest.length; i++) {
//                 if (userDestinationNames.includes(validDest[i].destinationName)) {
//                     availableButtons.push(0);
//                 } else {
//                     availableButtons.push(1);
//                 }
//             }
//             return response.render("category_page", { user: user, category: categoryRoute, destinations: validDest, available: availableButtons });
//         }
//     })


// })

app.route("/home/:category/:destinationID")
    .post(function (request, response) {
        const category = request.params.category;
        const destinationID = request.params.destinationID;
        const cookie = request.cookies.sessionID;
        console.log("Adding " + destinationID);
        // Destination.findOne({ _id: destinationID }, function (err, destination) {
        //     if (!err) {
        for (var i = 0; i < destinations.length; i++) {
            if (destinations[i]._id == destinationID) {
                var dest = destinations[i];
                // delete dest._id;
                NetworksUser.updateOne({ sessionID: cookie }, { $push: { destination: dest } }, function (err) {
                    if (!err) {
                        return response.redirect(`/home/${category}`);
                    }
                    else {
                        console.log(err);
                    }
                })
                break;
            }
        }
        // }
    })

app.route("/remove/:destinationID")
    .post(function (request, response) {
        const category = request.params.category;
        const destinationID = request.params.destinationID;
        const cookie = request.cookies.sessionID;

        var destination = destinations.find(item => {
            return item._id == destinationID;
        })
        NetworksUser.updateOne({ sessionID: cookie }, { $pull: { destination: { _id: destinationID } } }, function (err) {
            if (!err) {
                return response.redirect(`/want-to-go`);
            }
        })
    }
    )

app.route("/home/:category/:destinationID/details")
    .get(function (request, response) {
        const cookie = request.cookies.sessionID;
        const username = request.body.username;
        const destID = request.params.destinationID;

        var destination = destinations.find(item => {
            return item._id == destID;
        })
        
        if (destination != null) {
            NetworksUser.findOne({ sessionID: cookie }, function (err, user) {
                if (!err)
                    return response.render("details", { user: user, destination: destination })
            })
        } else {
            return response.redirect("*");
        }
    })


app.route("/search")
    .get(function (request, response) {
        const searchText = request.query.query;
        const destNames = [];
        const validDest = [];
        const cookie = request.cookies.sessionID;
        const userDestinationNames = [];
        const availableButtons = [];

        //Push all destination names to destNames
        for (let i = 0; i < destinations.length; i++) {
            destNames.push(destinations[i].destinationName.toLowerCase());
        }

        console.log("Searched for: " + searchText);
        //Push destination names that contains the searchText into validDest
        for (let i = 0; i < destNames.length; i++) {
            if (destNames[i].includes(searchText)) {
                validDest.push(destinations[i]);
            }
        }

        NetworksUser.findOne({ sessionID: cookie }, function (err, user) {
            if (!err) {
                for (let i = 0; i < user.destination.length; i++) {
                    userDestinationNames.push(user.destination[i].destinationName);
                }
                for (let i = 0; i < validDest.length; i++) {
                    if (userDestinationNames.includes(validDest[i].destinationName)) {
                        availableButtons.push(0);
                    } else {
                        availableButtons.push(1);
                    }
                }
                return response.render("search", { user: user, query: searchText, destinations: validDest, available: availableButtons });
            }
        })
    })

app.route("/search/:destinationID/:query")
    .post(function (request, response) {
        const destinationID = request.params.destinationID;
        const cookie = request.cookies.sessionID;
        for (var i = 0; i < destinations.length; i++) {
            if (destinations[i]._id == destinationID) {
                var dest = destinations[i];
                delete dest._id;
                NetworksUser.updateOne({ sessionID: cookie }, { $push: { destination: dest } }, function (err, user) {
                    if (!err) {
                        // return response.redirect(`/home/${category}`);
                        // return response.redirect(307, '/search');
                        // return response.redirect('back');
                        return response.redirect('/search?query=' + request.params.query);
                    }
                    else {
                        console.log(err);
                    }
                })
            }
        }
        // }
    })


app.route("/want-to-go")
    .get(function (request, response) {
        const cookie = request.cookies.sessionID;
        const userDestinations = [];
        const destID = [];
        const categoryNames = [];
        NetworksUser.findOne({ sessionID: cookie }, function (err, user) {
            if (!err) {
                const userDests = user?user.destination:[];
                // for (let i = 0; i < user.destination.length; i++) {
                //     userDestinations.push(user.destination[i].destinationName);
                //     categoryNames.push(user.destination[i].category);
                //     destID.push(user.destination[i]._id)
                // }
                // if (user.destination.length > 0) {
                return response.render("want-to-go", { user: user, destinations: userDests, message: userDests.length > 0 ? "" : "No destinations have been added yet." });
                // }
                // else {
                //     return response.render("want-to-go", { user: user, category: "", destinations: userDestinationNames, destinationID: "", message: "No destinations have been added yet" })
                // }
            }
            else {
                return response.redirect("*");
            }
        })

    })
    .post(function (request, response) {

    })

app.get('*', function (request, response) {
    response.status(404).render("error404");
})

app.listen(PORT, function () {
    console.log(`Server running on port: ${PORT}`);
})