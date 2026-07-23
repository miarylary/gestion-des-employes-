<?php
require_once 'config.php';
$data = json_decode(file_get_contents('php://input'), true);
try {
    $pdo = getConnection();
    $stmt = $pdo->prepare('INSERT INTO Employe (nom, salaire) VALUES (:nom, :salaire)');
    $stmt->execute([':nom' => $data['nom'], ':salaire' => $data['salaire']]);
    echo json_encode(['success' => true, 'message' => 'Insertion réussie', 'id' => $pdo->lastInsertId()]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Insertion échouée : ' . $e->getMessage()]);
}