package edu.brown.cs.student.server;

import com.squareup.moshi.Moshi;
import edu.brown.cs.student.csv.CSVData;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

public class StatsHandler implements Route {
  private final CSVData data;

  public StatsHandler(CSVData data) {
    this.data = data;
  }

  @Override
  public Object handle(Request request, Response response) {
    // Checks if there is a CSV already loaded
    if (this.data.getIsLoaded() != true) {
      return getFailureResponse("error_bad_request");
    }

    // Checks if the CSV was properly parsed
    List<List<String>> fileData = this.data.getData();
    if (fileData == null) {
      return getFailureResponse("error_datasource");
    }

    // CSV data
    int rows = fileData.size();
    int columns = fileData.get(0).size();

    return getSuccessResponse(rows, columns);
  }

  public Object getSuccessResponse(int rows, int columns) {
    // Creates map with failure response
    Map<String, Object> responses = new HashMap<>();
    responses.put("result", "success");
    responses.put("rows", rows);
    responses.put("columns", columns);

    // Serializes responses into JSON format
    Moshi moshi = new Moshi.Builder().build();
    return moshi.adapter(Map.class).toJson(responses);
  }

  public Object getFailureResponse(String responseType) {
    // Creates map with failure response
    Map<String, Object> responses = new HashMap<>();
    responses.put("result", responseType);

    // Serializes responses into JSON format
    Moshi moshi = new Moshi.Builder().build();
    return moshi.adapter(Map.class).toJson(responses);
  }
}
