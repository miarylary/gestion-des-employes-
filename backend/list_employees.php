<?php
require_once 'config.php';
try {
    $pdo = getConnection();
    $rows = $pdo->query('SELECT * FROM Employe ORDER BY numEmp')->fetchAll();
    $result = array_map(function($r) {
        $s = floatval($r['salaire']);
        $r['obs'] = $s < 1000 ? 'médiocre' : ($s <= 5000 ? 'moyen' : 'grand');
        return $r;
    }, $rows);
    echo json_encode($result);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}