from enum import Enum
from sklearn.preprocessing import LabelEncoder, OneHotEncoder, OrdinalEncoder

class CatColEncoder(str, Enum):
    NoEncoder = "None"
    OneHot   = "OneHot"
    Ordinal  = "Ordinal"
    Label    = "Label"

    def __str__(self):
        return str(self.value)

def map_catcolencoder(catcolencoder):   
    catcolencoder_switcher = {
        CatColEncoder.OneHot    : OneHotEncoder(handle_unknown='ignore'),
        CatColEncoder.Ordinal   : OrdinalEncoder(),
        CatColEncoder.Label     : LabelEncoder()
    }

    try:         
        return catcolencoder_switcher.get(catcolencoder)
    except (KeyError, AttributeError):
        log(f'Key "{catcolencoder}" is not present in catcolencoder_switcher dictionary')
        raise HTTPException(status_code=400, detail=f'Categorical colum encoder "{catcolencoder}" is not supported')