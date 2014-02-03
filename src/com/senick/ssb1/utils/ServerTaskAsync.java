package com.senick.ssb1.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;

import android.content.Context;
import android.os.AsyncTask;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import com.senick.ssb1.db.DbHelper;

public class ServerTaskAsync extends AsyncTask<String, Void, String> {
	
	public enum TaskType {
		REQUEST_CODE,
		CONFIRM_CODE,
		REQUEST_DB,
		REPORT
	}
	private TaskType taskType;
	private View outputView;
	private Context context;
	
    @Override
    protected String doInBackground(String... params) {
    	if ((params != null) && (params.length == 2)) {
    		if (params[0].equals("GET"))
    			return GET(params[1]);
    		if (params[0].equals("POST"))
    			return POST(params[1]);
    	}
    	return "system error, wrong parameters";
    }
    
    // onPostExecute displays the results of the AsyncTask.
    @Override
    protected void onPostExecute(String result) {
    	if (taskType == TaskType.CONFIRM_CODE) {
    		((TextView)outputView).setText(result);
    		return;
    	}
    	if (taskType == TaskType.REQUEST_CODE) {
    		((TextView)outputView).setText(result);
    		return;
    	}
    	if (taskType == TaskType.REQUEST_DB) {
    		DbHelper dbHelper = new DbHelper(context);
    		dbHelper.updateDatabase(result);
    		((TextView)outputView).setText("database updated");
    		return;
    	}
    	if (taskType == TaskType.REPORT) {
    		((TextView)outputView).setText("reported");
    		return;
    	}
    }
    
    private String GET(String url){
        InputStream inputStream = null;
        String result = "";
        try {
        	HttpClient httpclient = new DefaultHttpClient();
        	HttpResponse httpResponse = httpclient.execute(new HttpGet(url));
            
        	inputStream = httpResponse.getEntity().getContent();
            if(inputStream != null)
                result = convertInputStreamToString(inputStream);
            else
                result = "Did not work!";
 
        } catch (Exception e) {
            Log.d("InputStream", e.getLocalizedMessage());
        }
        return result;
    }
    
    private String POST(String url){
        InputStream inputStream = null;
        String result = "";
        try {
        	HttpClient httpclient = new DefaultHttpClient();
        	HttpResponse httpResponse = httpclient.execute(new HttpPost(url));
            
        	inputStream = httpResponse.getEntity().getContent();
            if(inputStream != null)
                result = convertInputStreamToString(inputStream);
            else
                result = "Did not work!";
 
        } catch (Exception e) {
            Log.d("InputStream", e.getLocalizedMessage());
        }
        return result;
    }
    
    private static String convertInputStreamToString(InputStream inputStream) throws IOException{
        BufferedReader bufferedReader = new BufferedReader( new InputStreamReader(inputStream));
        String line = "";
        String result = "";
        while((line = bufferedReader.readLine()) != null)
            result += line;
 
        inputStream.close();
        return result;
 
    }

	public View getOutputView() {return outputView;}
	public void setOutputView(View outputView) {this.outputView = outputView;}

	public TaskType getTaskType() {return taskType;}
	public void setTaskType(TaskType taskType) {this.taskType = taskType;}

	public Context getContext() {return context;}
	public void setContext(Context context) {this.context = context;}
}