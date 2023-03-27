const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const SECRET_CODE = "areyfyhujnbmkul";
const offer = require("../schemas/offer-schema");

const getUserByToken = (token) => {
    return new Promise((resolve, reject) => {
        if (token) {
            let userData
            try {
                const userData = jwt.verify(token, SECRET_CODE)
                resolve(userData)
            } catch (err) {
                reject("Invalid Token!")
            }
        }
        else {
            reject("Token not found")
        }
    })
}

router.get("/list", async (req, res) => {
    const validOffers = [];
    offer.find().then((offers) => {
        console.log(offers, "offer list")
        offers.filter((offer) => {
            const rules = offer.target.split("and")
            rules.forEach((rule) => {
                let ruleKey = null;
                if (rule.includes(">")) {
                    ruleKey = { key: rule.trim().split(">")[0], value: rule.trim().split(">")[1], operator: ">" }
                    if (req.body[ruleKey.key] > ruleKey.value) {
                        validOffers.push(offer)
                    }
                } else {
                    ruleKey = { key: rule.trim().split("<")[0], value: rule.trim().split("<")[1], operator: "<" }
                    if (req.body[ruleKey.key] < ruleKey.value) {
                        validOffers.push(offer)
                    }
                }

            })
        })
    }).catch(() => {
        res.status(500).send("Internal Server Error")
    })
})

router.post("/create", async (req, res) => {
    getUserByToken(req.headers.authorization).then((user) => {
        offer.create({ ...req.body, username: user.username }).then((offer) => {
            res.status(200).send(offer);
        }).catch((err) => {
            res.status(400).send({ message: err.message })
        })
    }).catch((err) => {
        res.status(400).send(err)
    })

})

router.put("/update", async (req, res) => {
    offer.updateOne("identifier data", "newData")
})

router.delete("/delete", async (req, res) => {
    offer.deleteOne({ _id: req.body.id })
})
module.exports = router;