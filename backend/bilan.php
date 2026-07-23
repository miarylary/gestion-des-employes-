<?php
require_once 'config.php';
try {
    $pdo = getConnection();
    $stats = $pdo->query('SELECT SUM(salaire) AS total, MIN(salaire) AS minimal, MAX(salaire) AS maximal, COUNT(*) AS nb FROM Employe')->fetch();
    $employes = $pdo->query('SELECT nom, salaire FROM Employe ORDER BY salaire DESC')->fetchAll();
    echo json_encode([
        'total'    => floatval($stats['total']),
        'minimal'  => floatval($stats['minimal']),
        'maximal'  => floatval($stats['maximal']),
        'nb'       => intval($stats['nb']),
        'employes' => $employes
    ]);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}