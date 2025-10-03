const {Router} = require('express')
// const authController = require("../controllers/authController");
const {requireAuth} = require("../middleware/authenticationMiddleware")
const mainController = require("../controllers/mainController");
const router = Router();

router.get("/"  ,mainController.main_get)
router.post("/api/correct" , mainController.correct_post);

module.exports = router;