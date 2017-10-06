<?php
	require_once 'OTpl.php';

	ob_start();

	function test_run($opt)
	{
		$DS       = DIRECTORY_SEPARATOR;
		$root     = __DIR__ . $DS;
		$out_dir  = $root . 'output';
		$url      = $root . '..' . $DS . 'files' . $DS . $opt['file'];
		$pinfos   = pathinfo($url);
		$fname    = $pinfos['filename'] . '.' . $pinfos['extension'] . '.html';
		$out_file = $out_dir . $DS . $fname;

		@mkdir($out_dir, 0777);

		$start = microtime(true);

		$o = new OTpl();
		$o->parse($url, true)
		  ->runSave($opt['data'], $out_file);

		$end      = microtime(true);
		$duration = $end - $start;

		echo "<table>
			<tbody>
				<tr><td>SOURCE</td><td>{$o->getSrcPath()}</td></tr>
				<tr><td>OUTPUT FILE</td><td><a href='./output/$fname' >Open</a></td></tr>
				<tr><td>START</td><td>$start</td></tr>
				<tr><td>END</td><td>$end</td></tr>
				<tr><td>DURATION (s) </td><td>$duration</td></tr>
			</tbody>
		</table>";
	}

	test_run([
		'file' => 'test-var-1.otpl',
		'data' => ['Franck', 23]
	]);

	test_run([
		'file' => 'test-var-2.otpl',
		'data' => [
			'name' => 'Franck',
			'age'  => 23
		]
	]);

	test_run([
		'file' => 'test-var-3.otpl',
		'data' => [
			['name' => 'Stella', 'age' => 41],
			['name' => 'Steve'],
			['name' => 'Franck', 'age' => 23]
		]
	]);

	test_run([
		'file' => 'test-attr.otpl',
		'data' => [
			'input' => [
				'id'          => 'name-field',
				'type'        => 'text',
				'placeholder' => 'Name',
				'value'       => 'toto'
			],
			'label' => 'Your name:'
		]
	]);

	test_run([
		'file' => 'test-loop.otpl',
		'data' => ['Apple', 'HTC', 'Samsung']
	]);

	test_run([
		'file' => 'sub/test-import.otpl',
		'data' => [
			'custom_import' => ['./../custom-import.otpl', 2017],
			'data_a'        => ['Franck', 23],
			'data_b'        => [
				'input' => [
					'id'          => 'name-field',
					'type'        => 'text',
					'placeholder' => 'Name',
					'value'       => 'toto'
				],
				'label' => 'Your name:'
			]
		]
	]);

	$content = ob_get_clean();

	echo <<<TPL
<!DOCTYPE html>
<html>
	<head>
		<meta name="format-detection" content="telephone=no">
		<meta name="msapplication-tap-highlight" content="no">
		<meta name="viewport"
			  content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width">
		<link rel="stylesheet" type="text/css" href="../web/css/style.css">
		<title>OTpl: PHP Test</title>
	</head>
	<body>
	$content
	</body>
</html>
TPL;

