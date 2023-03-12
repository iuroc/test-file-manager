<?php

/**
 * 创建文件/文件夹
 */
include './init_db.php';
$file_name = $_GET['file_name'];
$file_id = substr(str_shuffle(md5(time())), 0, 10);
$parent_id = $_GET['parent_id'];
$type = $_GET['type'];
$create_time = time();
$sql = <<<EOF
INSERT INTO `fileList` (`file_name`, `file_id`, `parent_id`, `type`, `create_time`)
VALUES ('$file_name', '$file_id', '$parent_id', $type, $create_time);
EOF;
$result = $db->exec($sql);
if (!$result) {
    die(json_encode(array(
        'code' => 202,
        'msg' => '数据库错误'
    )));
}
echo json_encode(array(
    'code' => 200,
    'msg' => '创建成功'
));
