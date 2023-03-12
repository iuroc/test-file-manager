<?php

/**
 * 移动文件/文件夹
 */
include './init_db.php';
$file_id = $_GET['file_id'];
$paste_to = $_GET['paste_to'];
$sql = <<<EOF
UPDATE `fileList` SET `parent_id` = '$paste_to' WHERE `file_id` = '$file_id';
EOF;

$result = $db->query($sql);
if (!$result) {
    die(json_encode(array(
        'code' => 202,
        'msg' => '数据库错误'
    )));
}

echo json_encode(array(
    'code' => 200,
    'msg' => '移动成功'
));
