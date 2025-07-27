const sqlite3 = require('sqlite3').verbose();
const db2 = new sqlite3.Database('runQamz.db');
let currentQueue = 0;

// เปิดหรือสร้างฐานข้อมูล runQamz.db

db2.serialize(function() {
    //db.run("CREATE TABLE numQ (queueNum INTEGER)");
    // สร้างตาราง numQ
    
   //const insertStmt = 
  db2.run("DELETE FROM numQ");
    //insertStmt.run(50);

   // insertStmt.finalize();

//db.close();
    // เพิ่มข้อมูลตัวอย่างลงในตาราง numQ

  // console.log(rows);});
  const stmt = db2.prepare("SELECT MAX(queueNum) AS maxQueue FROM numQ");
      stmt.all((err, rows) => {
          if (err) {
              throw err;
          }
          rows.forEach(row => {
          
         currentQueue = row.maxQueue;
            console.log(`คิวปัจจุบัน: ${currentQueue}`);
      });

      });
      stmt.finalize();
})

db2.close();
