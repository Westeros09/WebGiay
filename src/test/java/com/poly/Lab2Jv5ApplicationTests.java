package com.poly;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class Lab2Jv5ApplicationTests {

	
	    @Test
	    public void testAddition() {
	        int a = 2;
	        int b = 3;
	        int result = a + b;
	        assertEquals(5, result);
	    }
}
