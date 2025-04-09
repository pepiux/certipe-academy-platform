
<?php
// Funciones para manejar sesiones de usuario

// Generar un token de sesión
function generateSessionToken() {
    return bin2hex(random_bytes(32));
}

// Crear una nueva sesión para un usuario
function createSession($userId, $conn) {
    $token = generateSessionToken();
    $expiry = date('Y-m-d H:i:s', strtotime('+30 days'));
    
    $stmt = $conn->prepare("INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $userId, $token, $expiry);
    
    if ($stmt->execute()) {
        return $token;
    }
    
    return false;
}

// Verificar si una sesión es válida
function validateSession($token, $conn) {
    if (!$token) return false;
    
    $stmt = $conn->prepare("SELECT user_id FROM sessions WHERE token = ? AND expires_at > NOW()");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return $row['user_id'];
    }
    
    return false;
}

// Obtener el ID del usuario desde el token de autorización
function getUserIdFromToken($conn) {
    // Obtener token desde el header Authorization
    $headers = getallheaders();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    
    if (!$authHeader) {
        return false;
    }
    
    // Si el formato es "Bearer [token]", extraer el token
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $token = $matches[1];
        return validateSession($token, $conn);
    }
    
    return false;
}

// Eliminar una sesión (logout)
function deleteSession($token, $conn) {
    $stmt = $conn->prepare("DELETE FROM sessions WHERE token = ?");
    $stmt->bind_param("s", $token);
    return $stmt->execute();
}
?>
