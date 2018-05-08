(function() {
/*
 * OTpl js-1.1.5
 * Auto-generated file, please don't edit
 *
 */
	"use strict";

	OTpl
	.addLocalFile(
		"files/sub/simple_file_1.txt" ,
		"\r\nI’m a full stack developer. I spend my whole day, practically every day, experimenting with:\r\n- JavaScript,\r\n- Java,\r\n- PHP,\r\n- HTML,\r\n- CSS,\r\nand much more.\r\n"
	)
	.addLocalFile(
		"files/sub/simple_file_2.txt" ,
		"\r\n\r\nI’m curious, and I enjoy work that challenges me to learn something new and stretch in a different direction.\r\n\r\nI do my best to stay on top of changes in the state of the art so that I can meet challenges with tools well suited to what I do.\r\n\r\n"
	)
	.addLocalFile(
		"files/sub/test-import.otpl" ,
		"\n\n\n<%if ($.data_a){%>\n---------------------------------------------\n\t\timport: test-var-1.otpl\n---------------------------------------------\n\t\t<%@import('../test-var-1.otpl',$.data_a)%>\n\t\t\n <%}%>\n\n---------------------------------------------\n\t\timport: simple_file_1.txt\n---------------------------------------------\n\t<%@import('simple_file_1.txt')%>\n\n---------------------------------------------\n\t\timport: simple_file_2.txt\n---------------------------------------------\n\t<%@import('../../files/sub/simple_file_2.txt')%>\n\n---------------------------------------------\n\t\ttest: HtmlSetAttr\n---------------------------------------------\n<%@import('../test-attr.otpl',$.data_b)%>\n"
	)
	.addLocalFile(
		"files/test-attr.otpl" ,
		"<label for=\"<%$.input.id%>\" ><%$.label%></label><%if(2){%>45    <%}%>\r\n<input <%@HtmlSetAttr($.input)%> />"
	)
	.addLocalFile(
		"files/test-loop.otpl" ,
		"<select>\r\n\t<%loop($ : $key : $val){%>\r\n\t<option value=\"<%$key%>\" ><%$val%></option>\r\n\t<%}%>\r\n</select>\r\n<ul>\r\n\t<%loop($ : $val){%>\r\n\t<li><%$val%></li>\r\n\t<%}%>\r\n</ul>"
	)
	.addLocalFile(
		"files/test-var-1.otpl" ,
		"<span>My name is <%$[0]%> and i'm <% $[1] %></span>"
	)
	.addLocalFile(
		"files/test-var-2.otpl" ,
		"<span>My name is <% $.name %> and i'm <%$.age%></span>"
	)
	.addLocalFile(
		"files/test-var-3.otpl" ,
		"<%for(@var $i = 0; $i < @length($); $i++){%>\r\n\t<%if( @has($[$i],'age','numeric') ){%>\r\n\t<span><% $i+1 %> : my name is <% $[$i].name %> and i'm <%$[$i].age%>.</span><br/>\r\n\t<%} else {%>\r\n\t<span><% $i+1 %> : my name is <% $[$i].name %>.</span><br/>\r\n\t<%}%>\r\n<%}%>"
	);

})();