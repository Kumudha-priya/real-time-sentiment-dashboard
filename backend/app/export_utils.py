import pandas as pd


# -----------------------------------
# EXPORT RESULTS TO CSV
# -----------------------------------

def export_results_csv(results, filename="processed_results.csv"):

    df = pd.DataFrame(results)

    df.to_csv(filename, index=False)

    return filename