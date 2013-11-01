package com.senick.ssb1.db;

import android.provider.BaseColumns;

public class VariableContract {
	public VariableContract() {}
	
	public static abstract class Variables {
		//public static final String VALUE_NAME = "value_name";
	}
	
	public static abstract class VariableEntry implements BaseColumns {
		public static final String TABLE_NAME = "variable"; 
		public static final String COLUMN_NAME_NAME = "name"; //название переменной
		public static final String COLUMN_NAME_VALUE = "value"; //значение переменной
	}
	
	public static final String CREATE_TABLE = 
			"CREATE TABLE " + VariableEntry.TABLE_NAME + " (" + 
			VariableEntry._ID + " INTEGER PRIMARY KEY," +
			VariableEntry.COLUMN_NAME_NAME + " TEXT," +
			VariableEntry.COLUMN_NAME_VALUE + " INTEGER)";
	public static final String DROP_TABLE = 
			"DROP TABLE IF EXISTS " + VariableEntry.TABLE_NAME;
	public static final String DELETE_ENTRIES = 
			"DELETE FROM " + VariableEntry.TABLE_NAME;
	
}
