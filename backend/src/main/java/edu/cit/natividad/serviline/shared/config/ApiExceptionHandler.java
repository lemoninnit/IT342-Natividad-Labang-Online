package edu.cit.natividad.serviline.shared.config;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import edu.cit.natividad.serviline.shared.dto.ApiErrorResponse;

@ControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {

  @Override
  protected ResponseEntity<Object> handleMethodArgumentNotValid(
      MethodArgumentNotValidException ex,
      HttpHeaders headers,
      HttpStatusCode status,
      WebRequest request) {
    Map<String, String> errors = ex.getBindingResult().getFieldErrors().stream()
        .collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage, (first, second) -> first));

    ApiErrorResponse response = new ApiErrorResponse(status.value(), "Validation failed.", errors);
    return ResponseEntity.status(status).body(response);
  }

  @Override
  protected ResponseEntity<Object> handleHttpMessageNotReadable(
      HttpMessageNotReadableException ex,
      HttpHeaders headers,
      HttpStatusCode status,
      WebRequest request) {
    ApiErrorResponse response = new ApiErrorResponse(status.value(), "Invalid JSON payload.");
    return ResponseEntity.status(status).body(response);
  }

  @ExceptionHandler(Exception.class)
  @ResponseBody
  public ResponseEntity<ApiErrorResponse> handleAllExceptions(Exception ex) {
    ApiErrorResponse response = new ApiErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "An unexpected error occurred.");
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
  }
}
