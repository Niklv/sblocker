package com.senick.ssb1.db;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

public class DbHelper extends SQLiteOpenHelper {

	private static final String LOG_TAG = "DbHelper";
	
	public static final int DATABASE_VERSION = 1;
	public static final String DATABASE_NAME = "SSB.db";
	
	public DbHelper (Context context) {
		super (context, DATABASE_NAME, null, DATABASE_VERSION);
	}
	
	public DbHelper (Context context, int version) {
		super (context, DATABASE_NAME, null, version);
	}
	
	@Override
	public void onCreate(SQLiteDatabase db) {
		Log.v(LOG_TAG, "onCreate");
		db.execSQL(VariableContract.CREATE_TABLE);
		db.execSQL(SenderContract.CREATE_TABLE);
	}

	@Override
	public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
		Log.v(LOG_TAG, "onUpgrade");
		db.execSQL(VariableContract.DROP_TABLE);
		db.execSQL(SenderContract.DROP_TABLE);
		onCreate(db);
	}

	public void deleteEntries() {
		SQLiteDatabase db = this.getWritableDatabase();
		try {
			db.execSQL(VariableContract.DELETE_ENTRIES);
			Log.v(LOG_TAG, "variable_delete_entries: success");
		} catch (Exception e) {
			Log.v(LOG_TAG, "variable_delete_entries: exception");
		}
		try {
			db.execSQL(SenderContract.DELETE_ENTRIES);
			Log.v(LOG_TAG, "sender_delete_entries: success");
		} catch (Exception e) {
			Log.v(LOG_TAG, "charge_delete_entries: exception");
		}
	}
	
	public void initTables() {
		Log.v(LOG_TAG, "init tables");
    	SQLiteDatabase db = getWritableDatabase();
    	ContentValues values = new ContentValues();
    	values.put(SenderContract.SenderEntry._ID, 1);
    	values.put(SenderContract.SenderEntry.COLUMN_NAME_NUMBER, "89165798450");
    	values.put(SenderContract.SenderEntry.COLUMN_NAME_TYPE, "block");
    	values.put(SenderContract.SenderEntry.COLUMN_NAME_REASON, "spam");
    	values.put(SenderContract.SenderEntry.COLUMN_NAME_DESCRIPTION, "zadolbal");
    	values.put(SenderContract.SenderEntry.COLUMN_NAME_DATE, "1382363014323");
    	long id = db.insert(SenderContract.SenderEntry.TABLE_NAME, null, values);
    	Log.v(LOG_TAG, "inserted entry, id = " + id);
    	    	
        values = new ContentValues();
    	values.put(SenderContract.SenderEntry._ID, 2);
    	values.put(SenderContract.SenderEntry.COLUMN_NAME_NUMBER, "Kupi_Avto");
    	values.put(SenderContract.SenderEntry.COLUMN_NAME_TYPE, "block");
    	values.put(SenderContract.SenderEntry.COLUMN_NAME_REASON, "thief");
    	values.put(SenderContract.SenderEntry.COLUMN_NAME_DESCRIPTION, "zablockirovan");
    	values.put(SenderContract.SenderEntry.COLUMN_NAME_DATE, "1382363030386");
    	id = db.insert(SenderContract.SenderEntry.TABLE_NAME, null, values);
    	Log.v(LOG_TAG, "inserted entry, id = " + id);

    	values = new ContentValues();
    	values.put(SenderContract.SenderEntry._ID, 3);
    	values.put(SenderContract.SenderEntry.COLUMN_NAME_NUMBER, "900");
    	values.put(SenderContract.SenderEntry.COLUMN_NAME_TYPE, "allow");
    	values.put(SenderContract.SenderEntry.COLUMN_NAME_REASON, "bank-info number");
    	values.put(SenderContract.SenderEntry.COLUMN_NAME_DESCRIPTION, "shluz sberbanka");
    	values.put(SenderContract.SenderEntry.COLUMN_NAME_DATE, "1382363201109");
    	id = db.insert(SenderContract.SenderEntry.TABLE_NAME, null, values);
    	Log.v(LOG_TAG, "inserted entry, id = " + id);
    	
    	values = new ContentValues();
    	values.put(SenderContract.SenderEntry._ID, 4);
    	values.put(SenderContract.SenderEntry.COLUMN_NAME_NUMBER, "s.itsoft.ru");
    	values.put(SenderContract.SenderEntry.COLUMN_NAME_TYPE, "block");
    	values.put(SenderContract.SenderEntry.COLUMN_NAME_REASON, "spam");
    	values.put(SenderContract.SenderEntry.COLUMN_NAME_DESCRIPTION, "shluz spama");
    	values.put(SenderContract.SenderEntry.COLUMN_NAME_DATE, "1382363201109");
    	id = db.insert(SenderContract.SenderEntry.TABLE_NAME, null, values);
    	Log.v(LOG_TAG, "inserted entry, id = " + id);
    	    	
	}
	
	public ArrayList<Map<String,Object>> getAllSenders() {
		Log.v(LOG_TAG, "getAllSenders");
		SQLiteDatabase db = getReadableDatabase();
		Cursor c = db.query(
				SenderContract.SenderEntry.TABLE_NAME,
				null,
				null,
				null,
				null,
				null,
				null
				);
		int count = c.getCount();
		Log.v(LOG_TAG, "count of received senders = " + count);
		if (count <= 0) {
			ArrayList<Map<String,Object>> result = new ArrayList<Map<String,Object>>();
			return result;
		}
		ArrayList<Map<String,Object>> result = new ArrayList<Map<String,Object>>(count);
		c.moveToFirst();
		for (int i=0; i < count; i++) {
			Map<String,Object> m = new HashMap<String,Object>();
			String number = c.getString(c.getColumnIndexOrThrow(SenderContract.SenderEntry.COLUMN_NAME_NUMBER));
			String type = c.getString(c.getColumnIndexOrThrow(SenderContract.SenderEntry.COLUMN_NAME_TYPE));
			String reason = c.getString(c.getColumnIndexOrThrow(SenderContract.SenderEntry.COLUMN_NAME_REASON));
			String description = c.getString(c.getColumnIndexOrThrow(SenderContract.SenderEntry.COLUMN_NAME_DESCRIPTION));
			String date = c.getString(c.getColumnIndexOrThrow(SenderContract.SenderEntry.COLUMN_NAME_DATE));
			m.put(SenderContract.SenderEntry.COLUMN_NAME_NUMBER, number);
			m.put(SenderContract.SenderEntry.COLUMN_NAME_TYPE, type);
			m.put(SenderContract.SenderEntry.COLUMN_NAME_REASON, reason);
			m.put(SenderContract.SenderEntry.COLUMN_NAME_DESCRIPTION, description);
			m.put(SenderContract.SenderEntry.COLUMN_NAME_DATE, date);
			result.add(m);
			c.moveToNext();
		}
		return result;
	}
	
	public boolean isSpam(String sender) {
		try {
			SQLiteDatabase db = getReadableDatabase();
		    String selection = 	SenderContract.SenderEntry.COLUMN_NAME_NUMBER + " = '" + sender + "' AND " +
		    					SenderContract.SenderEntry.COLUMN_NAME_TYPE + " = 'block'";
		    String[] cols = {SenderContract.SenderEntry._ID};
			Cursor c = db.query(
					SenderContract.SenderEntry.TABLE_NAME,
					cols,
					selection,
					null,
					null,
					null,
					null
					);
			int count = c.getCount();
			if (count > 0) {
				return true;
			}
			return false;
		} catch (Exception e) {
			Log.v(LOG_TAG, "getVariable: expection");
			return false;
		}
	}
}
