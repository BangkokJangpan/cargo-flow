const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3001;

app.use(express.json());

// DB 연결
const db = new sqlite3.Database('d:/workspace/cargo-flow/cargo_flow.db');

// 1. 전체 배송 목록 조회
app.get('/api/shipments', (req, res) => {
  db.all('SELECT * FROM shipments', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 2. 배송 1건 조회
app.get('/api/shipments/:id', (req, res) => {
  db.get('SELECT * FROM shipments WHERE shipment_id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Not found' });
    const { shipment_id, ...rest } = row;
    res.json(rest);
  });
});

// 3. 배송 등록
app.post('/api/shipments', (req, res) => {
  const s = req.body;
  // vehicle_id, driver_id가 undefined/null이면 0으로 대체
  const vehicle_id = s.vehicle_id == null ? 0 : s.vehicle_id;
  const driver_id = s.driver_id == null ? 0 : s.driver_id;
  db.run(
    `INSERT INTO shipments (carrier_id, origin, destination, cargo, weight, volume, status, requestedTime, estimatedCost, specialInstructions, isUrgent, vehicle_id, driver_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [s.carrier_id, s.origin, s.destination, s.cargo, s.weight, s.volume, s.status, s.requestedTime, s.estimatedCost, s.specialInstructions, s.isUrgent, vehicle_id, driver_id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// 4. 배송 수정
app.put('/api/shipments/:id', (req, res) => {
  const s = req.body;
  // vehicle_id, driver_id가 undefined/null이면 0으로 대체
  const vehicle_id = s.vehicle_id == null ? 0 : s.vehicle_id;
  const driver_id = s.driver_id == null ? 0 : s.driver_id;
  db.run(
    `UPDATE shipments SET carrier_id=?, origin=?, destination=?, cargo=?, weight=?, volume=?, status=?, requestedTime=?, estimatedCost=?, specialInstructions=?, isUrgent=?, vehicle_id=?, driver_id=?
     WHERE shipment_id=?`,
    [s.carrier_id, s.origin, s.destination, s.cargo, s.weight, s.volume, s.status, s.requestedTime, s.estimatedCost, s.specialInstructions, s.isUrgent, vehicle_id, driver_id, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// 5. 배송 삭제
app.delete('/api/shipments/:id', (req, res) => {
  db.run('DELETE FROM shipments WHERE shipment_id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// === users CRUD ===
app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
app.get('/api/users/:id', (req, res) => {
  db.get('SELECT * FROM users WHERE user_id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});
app.post('/api/users', (req, res) => {
  const u = req.body;
  db.run(
    `INSERT INTO users (username, password_hash, name, email, role, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
    [u.username, u.password_hash, u.name, u.email, u.role, u.created_at],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ user_id: this.lastID });
    }
  );
});
app.put('/api/users/:id', (req, res) => {
  const u = req.body;
  db.run(
    `UPDATE users SET username=?, password_hash=?, name=?, email=?, role=?, created_at=? WHERE user_id=?`,
    [u.username, u.password_hash, u.name, u.email, u.role, u.created_at, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});
app.delete('/api/users/:id', (req, res) => {
  db.run('DELETE FROM users WHERE user_id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// === drivers CRUD ===
app.get('/api/drivers', (req, res) => {
  db.all('SELECT * FROM drivers', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
app.get('/api/drivers/:id', (req, res) => {
  db.get('SELECT * FROM drivers WHERE driver_id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});
app.post('/api/drivers', (req, res) => {
  const d = req.body;
  db.run(
    `INSERT INTO drivers (name, phone, carrier_id, license_number, status, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
    [d.name, d.phone, d.carrier_id, d.license_number, d.status, d.created_at],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ driver_id: this.lastID });
    }
  );
});
app.put('/api/drivers/:id', (req, res) => {
  const d = req.body;
  db.run(
    `UPDATE drivers SET name=?, phone=?, carrier_id=?, license_number=?, status=?, created_at=? WHERE driver_id=?`,
    [d.name, d.phone, d.carrier_id, d.license_number, d.status, d.created_at, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});
app.delete('/api/drivers/:id', (req, res) => {
  db.run('DELETE FROM drivers WHERE driver_id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// === vehicles CRUD ===
app.get('/api/vehicles', (req, res) => {
  db.all('SELECT vehicle_id, carrier_id, driver_id, number, vehicleType, capacity, currentLocation, rating, status, created_at FROM vehicles', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
app.get('/api/vehicles/:id', (req, res) => {
  db.get('SELECT vehicle_id, carrier_id, driver_id, number, vehicleType, capacity, currentLocation, rating, status, created_at FROM vehicles WHERE vehicle_id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});
app.post('/api/vehicles', (req, res) => {
  const v = req.body;
  db.run(
    `INSERT INTO vehicles (carrier_id, driver_id, number, vehicleType, capacity, currentLocation, rating, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [v.carrier_id, v.driver_id, v.number, v.vehicleType, v.capacity, v.currentLocation, v.rating, v.status, v.created_at],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ vehicle_id: this.lastID });
    }
  );
});
app.put('/api/vehicles/:id', (req, res) => {
  const v = req.body;
  db.run(
    `UPDATE vehicles SET carrier_id=?, driver_id=?, number=?, vehicleType=?, capacity=?, currentLocation=?, rating=?, status=?, created_at=? WHERE vehicle_id=?`,
    [v.carrier_id, v.driver_id, v.number, v.vehicleType, v.capacity, v.currentLocation, v.rating, v.status, v.created_at, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});
app.delete('/api/vehicles/:id', (req, res) => {
  db.run('DELETE FROM vehicles WHERE vehicle_id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// === carriers CRUD ===
app.get('/api/carriers', (req, res) => {
  db.all('SELECT * FROM carriers', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
app.get('/api/carriers/:id', (req, res) => {
  db.get('SELECT * FROM carriers WHERE carrier_id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});
app.post('/api/carriers', (req, res) => {
  const c = req.body;
  db.run(
    `INSERT INTO carriers (carrierName, contact, address, totalDeliveries, totalRevenue, platformFee, netAmount, status, settlementDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [c.carrierName, c.contact, c.address, c.totalDeliveries, c.totalRevenue, c.platformFee, c.netAmount, c.status, c.settlementDate],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ carrier_id: this.lastID });
    }
  );
});
app.put('/api/carriers/:id', (req, res) => {
  const c = req.body;
  db.run(
    `UPDATE carriers SET carrierName=?, contact=?, address=?, totalDeliveries=?, totalRevenue=?, platformFee=?, netAmount=?, status=?, settlementDate=? WHERE carrier_id=?`,
    [c.carrierName, c.contact, c.address, c.totalDeliveries, c.totalRevenue, c.platformFee, c.netAmount, c.status, c.settlementDate, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});
app.delete('/api/carriers/:id', (req, res) => {
  db.run('DELETE FROM carriers WHERE carrier_id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// === shipment_settlements CRUD ===
app.get('/api/shipment_settlements', (req, res) => {
  db.all('SELECT * FROM shipment_settlements', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
app.get('/api/shipment_settlements/:id', (req, res) => {
  db.get('SELECT * FROM shipment_settlements WHERE settlement_id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});
app.post('/api/shipment_settlements', (req, res) => {
  const s = req.body;
  db.run(
    `INSERT INTO shipment_settlements (shipment_id, matched_vehicle_id, carrier_id, driver_id, route, baseFare, timeFare, weightFare, totalFare, platformFee, carrierAmount, completedDate, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [s.shipment_id, s.matched_vehicle_id, s.carrier_id, s.driver_id, s.route, s.baseFare, s.timeFare, s.weightFare, s.totalFare, s.platformFee, s.carrierAmount, s.completedDate, s.status],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ settlement_id: this.lastID });
    }
  );
});
app.put('/api/shipment_settlements/:id', (req, res) => {
  const s = req.body;
  db.run(
    `UPDATE shipment_settlements SET shipment_id=?, matched_vehicle_id=?, carrier_id=?, driver_id=?, route=?, baseFare=?, timeFare=?, weightFare=?, totalFare=?, platformFee=?, carrierAmount=?, completedDate=?, status=? WHERE settlement_id=?`,
    [s.shipment_id, s.matched_vehicle_id, s.carrier_id, s.driver_id, s.route, s.baseFare, s.timeFare, s.weightFare, s.totalFare, s.platformFee, s.carrierAmount, s.completedDate, s.status, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});
app.delete('/api/shipment_settlements/:id', (req, res) => {
  db.run('DELETE FROM shipment_settlements WHERE settlement_id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// === kpi_stats CRUD ===
app.get('/api/kpi_stats', (req, res) => {
  db.all('SELECT * FROM kpi_stats', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
app.get('/api/kpi_stats/:id', (req, res) => {
  db.get('SELECT * FROM kpi_stats WHERE stat_id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});
app.post('/api/kpi_stats', (req, res) => {
  const k = req.body;
  db.run(
    `INSERT INTO kpi_stats (date, activeVehicles, completedDeliveries, emptyMileageRate, matchingSuccessRate, todayRevenue) VALUES (?, ?, ?, ?, ?, ?)`,
    [k.date, k.activeVehicles, k.completedDeliveries, k.emptyMileageRate, k.matchingSuccessRate, k.todayRevenue],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ stat_id: this.lastID });
    }
  );
});
app.put('/api/kpi_stats/:id', (req, res) => {
  const k = req.body;
  db.run(
    `UPDATE kpi_stats SET date=?, activeVehicles=?, completedDeliveries=?, emptyMileageRate=?, matchingSuccessRate=?, todayRevenue=? WHERE stat_id=?`,
    [k.date, k.activeVehicles, k.completedDeliveries, k.emptyMileageRate, k.matchingSuccessRate, k.todayRevenue, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});
app.delete('/api/kpi_stats/:id', (req, res) => {
  db.run('DELETE FROM kpi_stats WHERE stat_id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// === matching_queue CRUD ===
app.get('/api/matching_queue', (req, res) => {
  db.all('SELECT * FROM matching_queue', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
app.get('/api/matching_queue/:id', (req, res) => {
  db.get('SELECT * FROM matching_queue WHERE queue_id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});
app.post('/api/matching_queue', (req, res) => {
  const m = req.body;
  db.run(
    `INSERT INTO matching_queue (shipment_id, urgency, requestTime, matchingScore, status, matchedVehicleId) VALUES (?, ?, ?, ?, ?, ?)`,
    [m.shipment_id, m.urgency, m.requestTime, m.matchingScore, m.status, m.matchedVehicleId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ queue_id: this.lastID });
    }
  );
});
app.put('/api/matching_queue/:id', (req, res) => {
  const m = req.body;
  db.run(
    `UPDATE matching_queue SET shipment_id=?, urgency=?, requestTime=?, matchingScore=?, status=?, matchedVehicleId=? WHERE queue_id=?`,
    [m.shipment_id, m.urgency, m.requestTime, m.matchingScore, m.status, m.matchedVehicleId, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});
app.delete('/api/matching_queue/:id', (req, res) => {
  db.run('DELETE FROM matching_queue WHERE queue_id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// === companies CRUD ===
app.get('/api/companies', (req, res) => {
  db.all('SELECT * FROM companies', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// === emptyruns CRUD ===
app.get('/api/emptyruns', (req, res) => {
  db.all('SELECT * FROM emptyruns', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
app.get('/api/emptyruns/:id', (req, res) => {
  db.get('SELECT * FROM emptyruns WHERE emptyrun_id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});
app.post('/api/emptyruns', (req, res) => {
  const e = req.body;
  db.run(
    `INSERT INTO emptyruns (vehicle_id, driver_id, origin, destination, departure_date, departure_time, arrival_time, available_weight, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [e.vehicle_id, e.driver_id, e.origin, e.destination, e.departure_date, e.departure_time, e.arrival_time, e.available_weight, e.status],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ emptyrun_id: this.lastID });
    }
  );
});
app.put('/api/emptyruns/:id', (req, res) => {
  const e = req.body;
  db.run(
    `UPDATE emptyruns SET vehicle_id=?, driver_id=?, origin=?, destination=?, departure_date=?, departure_time=?, arrival_time=?, available_weight=?, status=? WHERE emptyrun_id=?`,
    [e.vehicle_id, e.driver_id, e.origin, e.destination, e.departure_date, e.departure_time, e.arrival_time, e.available_weight, e.status, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});
app.delete('/api/emptyruns/:id', (req, res) => {
  db.run('DELETE FROM emptyruns WHERE emptyrun_id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

app.listen(port, () => {
  console.log(`API 서버 실행 중: http://localhost:${port}`);
}); 