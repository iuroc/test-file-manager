<?php

/**
 * 获取文件和文件夹
 */
include './init_db.php';
$parent_id = $_GET['parent_id'];
$sql = <<<EOF
SELECT * FROM `fileList` WHERE `parent_id` = '$parent_id';
EOF;

$data = array();
$result = $db->query($sql);
while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
    array_push($data, $row);
}

echo json_encode(array(
    'code' => 200,
    'msg' => '获取成功',
    'result' => $data
));
