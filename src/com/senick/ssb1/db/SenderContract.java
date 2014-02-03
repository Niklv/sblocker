package com.senick.ssb1.db;

import android.provider.BaseColumns;

public class SenderContract {

	public SenderContract() {}
	
	public static abstract class SenderEntry implements BaseColumns {
		public static final String TABLE_NAME = "sender"; 
		public static final String COLUMN_NAME_TYPE = "type";
		public static final String COLUMN_NAME_NUMBER = "number";
		public static final String COLUMN_NAME_REASON = "reason";
		public static final String COLUMN_NAME_DESCRIPTION = "description";
		public static final String COLUMN_NAME_DATE = "date";
	}
	
	public static final String CREATE_TABLE = 
			"CREATE TABLE " + SenderEntry.TABLE_NAME + " (" + 
			SenderEntry._ID + " INTEGER PRIMARY KEY," +
			SenderEntry.COLUMN_NAME_TYPE + " TEXT," +
			SenderEntry.COLUMN_NAME_NUMBER + " TEXT," +
			SenderEntry.COLUMN_NAME_REASON + " TEXT," + 
			SenderEntry.COLUMN_NAME_DESCRIPTION + " TEXT," +
			SenderEntry.COLUMN_NAME_DATE + " TEXT)";
	public static final String DROP_TABLE = 
			"DROP TABLE IF EXISTS " + SenderEntry.TABLE_NAME;
	public static final String DELETE_ENTRIES = 
			"DELETE FROM " + SenderEntry.TABLE_NAME;	
	
}
