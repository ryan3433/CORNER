import db from "../mysql";

export const search = (req, res) => {
  const searchingBy = req.query.term;
  console.log(searchingBy);
  db.query(
    "SELECT idx, subject, content, user_name, nation, hit, DATE_FORMAT(created, '%y/%b/%d') AS created FROM board WHERE content=? OR subject=?",
    [searchingBy, searchingBy],
    (err, rows) => {
      if (err) console.log(err);
      console.log(rows);
      res.render("search", {
        rows
      });
    }
  );
};

export const boardList = (req, res) => {
  const nation = req.params.nation;
  const page = req.params.page;
  //const boardlist = [];
  db.query(
    "SELECT idx, subject, content, user_name, nation, hit, DATE_FORMAT(created, '%y/%b/%d') AS created FROM board WHERE nation=?",
    [nation],
    (err, rows) => {
      if (err) {
        console.log(err);
      }
      res.render("board", {
        rows,
        page,
        num: 6,
        pass: true,
        length: rows.length - 1
      });
    }
  );
};

export const boardDetail = (req, res) => {
  const brdId = req.params.idx;
  const page = req.params.page;
  db.beginTransaction(err => {
    if (err) console.log(err);
    db.query(`UPDATE board SET hit=hit+1 WHERE idx=?`, [brdId], err => {
      if (err) {
        console.log(err);
        db.rollback(() => console.error("rollback error1"));
      }
      db.query(
        `SELECT idx, subject, content, user_id, user_name, nation, hit, DATE_FORMAT(created, '%y/%b/%d') AS created FROM board WHERE idx=?`,
        [brdId],
        (err, rows) => {
          if (err) {
            console.log(err);
            db.rollback("rollback error2");
          } else {
            db.commit(err => {
              if (err) console.log(err);
              res.render("read", { rows, page });
            });
          }
        }
      );
    });
  });
};

export const getWrite = (req, res) => res.render("write");

export const postWrite = (req, res) => {
  const subject = req.body.subject;
  const userId = req.user.id;
  const userName = req.user.name;
  const content = req.body.content;
  const nation = req.body.nation;

  db.beginTransaction(err => {
    if (err) console.log(err);
    db.query(
      `INSERT INTO board(subject, content, user_id, user_name, nation) VALUES(?,?,?,?,?)`,
      [subject, content, userId, userName, nation],
      err => {
        if (err) {
          console.log(err);
          db.rollback(() => console.error("rollback error1"));
        }
        db.query(`SELECT LAST_INSERT_ID() as idx`, (err, rows) => {
          if (err) {
            console.log(err);
            db.rollback(() => console.error("rollback error2"));
          } else {
            db.commit(err => {
              if (err) console.log(err);
              var idx = rows[0].idx;
              res.redirect(`/board/${nation}/idx${idx}`);
            });
          }
        });
      }
    );
  });
};

export const getUpdate = (req, res) => {
  const brdId = req.params.idx;
  const nation = req.params.nation;
  db.query(
    `SELECT idx, subject, content, created, user_name, nation, hit FROM board WHERE idx=?`,
    [brdId],
    (err, rows) => {
      if (err) {
        console.log(err);
      } else {
        console.log(rows[0]);
        res.render("update", { rows, nation });
      }
    }
  );
};

export const postUpdate = (req, res) => {
  const brdId = req.params.idx;
  const subject = req.body.subject;
  const userName = req.body.user_name;
  const content = req.body.content;
  const nation = req.body.nation;

  db.query(
    `UPDATE board SET subject=?, content=?, user_name=?, nation=? WHERE idx=?`,
    [subject, content, userName, nation, brdId],
    err => {
      if (err) console.log(err);
      res.redirect(`/board/${nation}/idx${brdId}`);
    }
  );
};

export const deleteBoard = (req, res) => {
  const brdId = req.params.idx;
  db.query(`DELETE FROM board WHERE idx=?`, [brdId], err => {
    if (err) console.log;
    res.redirect("/board");
  });
};
