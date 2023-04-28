const db = require("../../plugins/mysql");
const TABLE = require("../../util/TABLE");
const STATUS = require("../../util/STATUS");
const { resData, currentTime, isEmpty } = require("../../util/lib");
const moment = require("../../util/moment");

//전체 row 갯수
const getTotal = async () => {
  // const getTotal = async function () {
  try {
    const query = `SELECT COUNT(*) AS cnt FROM ${TABLE.SOC}`;
    const [[{ cnt }]] = await db.execute(query);
    return cnt;
  } catch (e) {
    console.log(e.message);
    return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
  }
};

// row 존재유무
const getSelectOne = async (id) => {
  // const getTotal = async function () {
  try {
    const query = `SELECT COUNT(*) AS cnt FROM ${TABLE.SOC} WHERE id=?`;
    const values = [id];
    const [[{ cnt }]] = await db.execute(query, values);
    return cnt;
  } catch (e) {
    console.log(e.message);
    return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
  }
};

// 페이징으로 가져오기
const getList = async (req) => {
  try {
    // 마지막 id, len 갯수
    const lastId = parseInt(req.query.lastId) || 0;
    const len = parseInt(req.query.len) || 100;

    let where = "";
    if (lastId) {
      // 0은 false
      where = `WHERE id < ${lastId}`;
    }
    const query = `SELECT * FROM ${TABLE.SOC} ${where} order by id desc limit 0, ${len}`;
    const [rows] = await db.execute(query);
    return rows;
  } catch (e) {
    console.log(e.message);
    return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
  }
};

const socController = {
  // create
  create: async (req) => {
    const { player, position, team, game, goal } = req.body;
    if (isEmpty(player) || isEmpty(position) || isEmpty(team) || isEmpty(game) || isEmpty(goal)) {
      return resData(STATUS.E100.result, STATUS.E100.resultDesc, moment().format('LT'));
    }

    try {
      const query = `INSERT INTO soc (player, position, team, game, goal) VALUES (?,?,?,?,?)`;
      const values = [player, position, team, game, goal];
      const [rows] = await db.execute(query, values);
      if (rows.affectedRows == 1) {
        return resData(
          STATUS.S200.result,
          STATUS.S200.resultDesc,
          moment().format('LT'),
        );
      }
    } catch (e) {
      console.log(e.message);
      return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
    }
  },

  // list
  list: async (req) => {
    // 화살표함수는 es6문법 this접근안됨
    const totalCount = await getTotal();
    const list = await getList(req);
    if (totalCount > 0 && list.length) {
      return resData(
        STATUS.S200.result,
        STATUS.S200.resultDesc,
        moment().format('LT'),
        { totalCount, list }
      );
    } else {
      return resData(STATUS.S201.result, STATUS.S201.resultDesc, moment().format('LT'));
    }
  },

  //update
  update: async (req) => {
    const { id } = req.params; // url /로 들어오는것
    const { player, position, team, game, goal } = req.body;
    if (isEmpty(id) || isEmpty(player) || isEmpty(position) || isEmpty(team) || isEmpty(game) || isEmpty(goal)) {
      return resData(STATUS.E100.result, STATUS.E100.resultDesc, moment().format('LT'));
    }

    try {
      const query = `UPDATE ${TABLE.SOC} SET player= ?, position= ?, team= ?, game= ?, goal= ? WHERE id= ?`;
      const values = [player, position, team, game, goal, id];
      const [rows] = await db.execute(query, values);
      if (rows.affectedRows == 1) {
        return resData(
          STATUS.S200.result,
          STATUS.S200.resultDesc,
          moment().format('LT')
        );
      }
    } catch (e) {
      console.log(e.message);
      return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
    }
  },

  //delete
  delete: async (req) => {
    const { id } = req.params; // url /로 들어오는것
    if (isEmpty(id)) {
      return resData(STATUS.E100.result, STATUS.E100.resultDesc, moment().format('LT'));
    }
    const cnt = await getSelectOne(id);
    try {
      if (!cnt) {
        return resData(
          STATUS.E100.result,
          STATUS.E100.resultDesc,
          moment().format('LT')
        );
      }
      const query = `DELETE FROM ${TABLE.SOC} WHERE id = ?;`;
      const values = [id];
      const [rows] = await db.execute(query, values);
      if (rows.affectedRows == 1) {
        return resData(
          STATUS.S200.result,
          STATUS.S200.resultDesc,
          moment().format('LT')
        );
      }
    } catch (e) {
      console.log(e.message);
      return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
    }
    return rows;
  },

    //reset
    reset: async (req) => {
      // truncate
       try {
         const query = `TRUNCATE TABLE ${TABLE.SOC};`;
         await db.execute(query);
       } catch (error) {
         console.log(e.message);
         return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
       }
    
      // insert
       const { player } = req.body;
       const position = req.body.position || "FW";
       const team = req.body.team;
       const game = req.body.game;
       const goal = req.body.goal;
       const len = req.body.len || 100;
       if (isEmpty(player)) {
         return resData(STATUS.E100.result, STATUS.E100.resultDesc, moment().format('LT'));
       }
       try {
        //더미쌓기 타이틀에 1씩추가하면서 인서트하기
      let query = `INSERT INTO soc (player, position, team, game, goal) VALUES `; //.values( data1 ), (data2),,,
      let arr = [];
      for (let i = 0; i < len; i++) {
        arr.push(`('${player}_${i}', '${position}', '${team}', '${game}', '${goal}')`);
      }
      query = query + arr.join(",");
      const [rows] = await db.execute(query);

      if (rows.affectedRows != 0) {
        return resData(
          STATUS.S200.result,
          STATUS.S200.resultDesc,
          moment().format('LT')
        );
      }
    } catch (e) {
      console.log(e.message);
      return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
    }
  },

  getTeam: async (req) => {
    try {
      const { team } = req.params;
      //nconst query = `SELECT * FROM ${TABLE.SOC} ${where} order by team desc limit 0, ${len}`;
      const query = `SELECT * FROM ${TABLE.SOC} WHERE team = ?`;
      const value = [team];
      const [rows] = await db.execute(query, value);
      console.log(rows)
      return rows;
    } catch (e) {
      console.log(e.message);
      return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
    }
  },

  getPosition: async (req) => {
    try {
      const { position } = req.params;
      const query = `SELECT * FROM ${TABLE.SOC} WHERE position = ?`;
      const value = [position];
      const [rows] = await db.execute(query, value);
      console.log(rows)
      return rows;
    } catch (e) {
      console.log(e.message);
      return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
    }
  },

  getGoal: async (req) => {
    try {
      const { goal } = req.params;
      const query = `SELECT * FROM ${TABLE.SOC} WHERE goal = ?`;
      const value = [goal];
      const [rows] = await db.execute(query, value);
      console.log(rows)
      return rows;
    } catch (e) {
      console.log(e.message);
      return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
    }
  },

  // getHighGoal: async (req) => {
  //   try {
  //     const { goal } = req.params;
  //     const query = `SELECT * FROM ${TABLE.SOC} WHERE goal = ? order by goal desc`;
  //     const value = [goal];
  //     const [rows] = await db.execute(query, value);
  //     console.log(rows)
  //     return rows;
  //   } catch (e) {
  //     console.log(e.message);
  //     return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
  //   }
  // },

  getHighGoal: async (req) => {
    try {
      // 마지막 id, len 갯수
      const lastId = parseInt(req.query.lastId) || 0;
      const len = parseInt(req.query.len) || 100;
  
      let where = "";
      if (lastId) {
        // 0은 false
        where = `WHERE id < ${lastId}`;
      }
      const query = `SELECT * FROM ${TABLE.SOC} ${where} order by goal desc limit 0, ${len}`;
      const [rows] = await db.execute(query);
      return rows;
    } catch (e) {
      console.log(e.message);
      return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
    }
  },

  // getHighGame: async (req) => {
  //   try {
  //     const { game } = req.params;
  //     const query = `SELECT * FROM ${TABLE.SOC} WHERE game = ? order by game desc`;
  //     const value = [game];
  //     const [rows] = await db.execute(query, value);
  //     console.log(rows)
  //     return rows;
  //   } catch (e) {
  //     console.log(e.message);
  //     return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
  //   }
  // },

  getHighGame: async (req) => {
    try {
      // 마지막 id, len 갯수
      const lastId = parseInt(req.query.lastId) || 0;
      const len = parseInt(req.query.len) || 100;
  
      let where = "";
      if (lastId) {
        // 0은 false
        where = `WHERE id < ${lastId}`;
      }
      const query = `SELECT * FROM ${TABLE.SOC} ${where} order by game desc limit 0, ${len}`;
      const [rows] = await db.execute(query);
      return rows;
    } catch (e) {
      console.log(e.message);
      return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
    }
  },
  
  
};

module.exports = socController;