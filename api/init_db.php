<?php

/**
 * 初始化数据库
 */
// error_reporting(0);
$db = new SQLite3('file_sysytem.db');

if (!$db) {
    die(array(
        'code' => 202,
        'msg' => '数据库错误'
    ));
}

$sql = <<<EOF
CREATE TABLE IF NOT EXISTS `fileList` (
    `file_name` TEXT NOT NULL,
    `file_id` CHAR(10) NOT NULL UNIQUE,
    `parent_id` CHAR(10) NOT NULL,
    `type` INT NOT NULL,
    `create_time` INT NOT NULL
)
EOF;
$db->exec($sql);

/**
 * 模拟插入
 */
function monicharu($db)
{
    for ($x = 0; $x < 15; $x++) {
        $create_time  = time();
        $file_name = substr(str_shuffle(md5($create_time)), 0, 10);
        $file_id = substr(str_shuffle(md5($create_time)), 0, 10);
        $parent_id = 0;
        $type = rand(0, 1);
        $sql = <<<EOF
INSERT INTO `fileList` (`file_name`, `file_id`, `parent_id`, `type`, `create_time`)
VALUES ('$file_name', '$file_id', '$parent_id', $type, $create_time);
EOF;
        $db->exec($sql);
    }
}

// monicharu($db);