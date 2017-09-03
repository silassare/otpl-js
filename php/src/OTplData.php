<?php
/**
 * Copyright (c) Emile Silas Sare <emile.silas@gmail.com>
 *
 * This file is part of Otpl.
 */

final class OTplData {
		private $data = null;
		private $context = null;

		public function __construct( $data, $context ) {
			$this->data = $data;
			$this->context = $context;
		}

		public function getContext() {
			return $this->context;
		}

		public function getData() {
			return $this->data;
		}

	}