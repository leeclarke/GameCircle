FileManagerTest = TestCase("FileManagerTest");

FileManagerTest.prototype.testNewFile = function() {
	respMap = FileManager.newFile(30,30);
	assertNotNull(respMap);
	assertTrue(respMap.length === 30);
	assertTrue(respMap[0].length === 30);
};
