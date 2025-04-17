
<?php
// Script de diagnóstico para verificar contraseñas
require_once 'config.php';

// Definir las credenciales a verificar
$email = isset($_GET['email']) ? $_GET['email'] : 'estudiante@certipe.com';
$password = isset($_GET['password']) ? $_GET['password'] : 'estudiante123';

// Mostrar información
echo "<h1>Verificación de contraseña</h1>";
echo "<p>Email: " . htmlspecialchars($email) . "</p>";
echo "<p>Password a verificar: " . htmlspecialchars($password) . "</p>";

// Conectar a la base de datos
try {
    $conn = connect_db();
    echo "<p>Conexión a la base de datos exitosa</p>";
} catch (Exception $e) {
    die("<p>Error de conexión a la base de datos: " . htmlspecialchars($e->getMessage()) . "</p>");
}

// Consultar usuario
try {
    $stmt = $conn->prepare("SELECT id, name, email, password, role FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    // Verificar si existe el usuario
    if ($result->num_rows === 0) {
        echo "<p style='color: red;'>Error: Usuario no encontrado en la base de datos</p>";
        $conn->close();
        exit;
    }
    
    // Obtener datos del usuario
    $user = $result->fetch_assoc();
    echo "<p>Usuario encontrado: " . htmlspecialchars($user['name']) . "</p>";
    echo "<p>Hash almacenado: " . htmlspecialchars($user['password']) . "</p>";
    
    // Verificar contraseña
    if (password_verify($password, $user['password'])) {
        echo "<p style='color: green;'>✅ La contraseña es CORRECTA</p>";
        
        // Para diagnóstico: Crear un nuevo hash para comparar
        $new_hash = password_hash($password, PASSWORD_DEFAULT);
        echo "<p>Nuevo hash generado: " . htmlspecialchars($new_hash) . "</p>";
        echo "<p>Recuerda que dos hashes diferentes pueden ser válidos para la misma contraseña</p>";
    } else {
        echo "<p style='color: red;'>❌ La contraseña es INCORRECTA</p>";
        
        // Salida detallada de información para diagnóstico
        echo "<p>Algoritmo encontrado en el hash: " . htmlspecialchars(password_get_info($user['password'])['algoName']) . "</p>";
        echo "<p>Para actualizar manualmente la contraseña, puedes ejecutar esto en SQL:</p>";
        $new_hash = password_hash($password, PASSWORD_DEFAULT);
        echo "<pre>UPDATE users SET password = '" . htmlspecialchars($new_hash) . "' WHERE email = '" . htmlspecialchars($email) . "';</pre>";
    }
} catch (Exception $e) {
    echo "<p style='color: red;'>Error al procesar la verificación: " . htmlspecialchars($e->getMessage()) . "</p>";
} finally {
    // Cerrar recursos
    if (isset($stmt)) $stmt->close();
    if (isset($conn)) $conn->close();
}
?>

<p>Notas adicionales:</p>
<ul>
    <li>Si la verificación de contraseña falla, asegúrate de que estás usando la contraseña correcta.</li>
    <li>En PHP, <code>password_verify()</code> maneja el salt automáticamente.</li>
    <li>El salt está incluido como parte del hash almacenado.</li>
</ul>
