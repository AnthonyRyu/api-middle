const router = require('express').Router();
const socController = require('./_controller/socController');


// create
router.post("/", async (req, res) => {
    const result = await socController.create(req);
    res.json(result);
    });


// list
router.get('/', async (req,res)=>{
    const result = await socController.list(req);
    res.json(result);
})

// update
router.put('/:id', async (req,res)=>{
    const result = await socController.update(req);
    res.json(result);
})

// delete
router.delete('/:id', async (req,res)=>{
    const result = await socController.delete(req);
    res.json(result);
})

// truncate, dummy insert
router.post('/reset', async (req,res)=>{
    const result = await socController.reset(req);
    res.json(result);
})

// 원하는 팀의 선수들만 출력
router.get('/team/:team', async (req,res)=>{
    const result = await socController.getTeam(req);
    res.json(result);
})

// 특정 포지션별로 해당하는 선수 출력(FW, MF, DF, GK)
router.get('/position/:position', async (req,res)=>{
    const result = await socController.getPosition(req);
    res.json(result);
})

// 특정 골을 득점한 선수 출력
router.get('/goal/:goal', async (req,res)=>{
    const result = await socController.getGoal(req);
    res.json(result);
})

// 많은 골을 득점한 순서대로 출력
router.get('/getHighGoal/getHighGoal', async (req,res)=>{
    const result = await socController.getHighGoal(req);
    res.json(result);
})

// 많은 경기를 소화한 순서대로 출력
router.get('/getHighGame/getHighGame', async (req,res)=>{
    const result = await socController.getHighGame(req);
    res.json(result);
})



module.exports = router;