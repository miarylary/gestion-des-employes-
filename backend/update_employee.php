<?php
require_once 'config.php';
$data = json_decode(file_get_contents('php://input'), true);
$method = $_SERVER['REQUEST_METHOD'];
try {
    $pdo = getConnection();
    if ($method === 'PUT') {
        $stmt = $pdo->prepare('UPDATE Employe SET nom=:nom, salaire=:salaire WHERE numEmp=:id');
        $stmt->execute([':nom' => $data['nom'], ':salaire' => $data['salaire'], ':id' => $data['numEmp']]);
        echo json_encode(['success' => true, 'message' => 'Modification réussie']);
    } elseif ($method === 'DELETE') {
        $stmt = $pdo->prepare('DELETE FROM Employe WHERE numEmp=:id');
        $stmt->execute([':id' => $data['numEmp']]);
        echo json_encode(['success' => true, 'message' => 'Suppression réussie']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Opération échouée : ' . $e->getMessage()]);
}