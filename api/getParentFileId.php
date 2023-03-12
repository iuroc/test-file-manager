<?php

/**
 * 获取文件(夹)的所处文件夹ID
 */
include './init_db.php';
$file_id = $_GET['file_id'];
$sql = <<<EOF
SELECT * FROM `fileList` WHERE `file_id` = '$file_id' LIMIT 1;
EOF;
$result = $db->query($sql);
$empty = array();
while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
    array_push($empty, 1);
    $parent_id = $row['parent_id'];
}

if (count($empty) == 0) {
    die(json_encode(array(
        'code' => 201,
        'msg' => '查询结果为空'
    )));
}

echo json_encode(array(
    'code' => 200,
    'msg' => '获取成功',
    'result' => $parent_id
));
