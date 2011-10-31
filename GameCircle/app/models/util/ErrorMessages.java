package models.util;

import java.util.ArrayList;
import java.util.List;

public class ErrorMessages {

    public int status;
    public List<FieldError> errors;

    public ErrorMessages(){
        errors = new ArrayList<FieldError>();
        status = 404;
    }
}
