import numpy as np
import netCDF4
import matplotlib.pyplot as plt
import os
import argparse
import sqlite3
import csv

def hillshade(z, azimuth=315.0, angle_altitude=45.0):
    """Generate a hillshade image from DEM.

    Notes: adapted from example on GeoExamples blog,
    published March 24, 2014, by Roger Veciana i Rovira.
    """
    x, y = np.gradient(z)
    slope = np.pi / 2.0 - np.arctan(np.sqrt(x**2 + y**2))  # slope gradient
    aspect = np.arctan2(-x, y)  # aspect
    azimuthrad = azimuth * np.pi / 180.0  # convert lighting azimuth to radians
    altituderad = angle_altitude * np.pi / 180.0  # convert lighting altitude to radians
    shaded = np.sin(altituderad) * np.sin(slope) + np.cos(altituderad) * np.cos(
        slope
    ) * np.cos(azimuthrad - aspect)
    return 255 * (shaded + 1) / 2  # return result scaled 0 to 255

def make_hillshade(path, out_dir):
    nc_file = netCDF4.Dataset(path)
    elevation_array = np.array(nc_file.variables['topographic__elevation'][:][0])
    hsh = hillshade(elevation_array)
    name = os.path.splitext(os.path.split(path)[-1])[0]
    output = os.path.join(out_dir, "%s.png" % name)
    plt.imsave(output, hsh, cmap="gray")

def process_hillshades(args):
    input_directory = args.id
    output_directory = args.od
    for file_path in os.listdir(input_directory):
        if os.path.splitext(file_path)[1] == ".nc":
            make_hillshade(os.path.join(input_directory, file_path), output_directory)

def db_to_csv(args):
    connection = sqlite3.connect(args.d)
    cursor = connection.cursor()
    query = "SELECT %s from %s" % (str(tuple(args.c)).replace("'", "\"")[1:-1], args.t)
    result = cursor.execute(query)
    rows = result.fetchall()
    with open(args.o, 'w') as output_file:
        writer = csv.writer(output_file)
        writer.writerow(args.c)
        writer.writerows(rows)
        
def main():
    parser = argparse.ArgumentParser()
    subparsers = parser.add_subparsers()
    parse_hillshade = subparsers.add_parser("hillshade")
    parse_hillshade.set_defaults(func=process_hillshades)
    parse_hillshade.add_argument("-id")
    parse_hillshade.add_argument("-od")
    parse_csv = subparsers.add_parser("tocsv")
    parse_csv.set_defaults(func=db_to_csv)
    parse_csv.add_argument("-d")
    parse_csv.add_argument("-o")
    parse_csv.add_argument("-t")
    parse_csv.add_argument("-c", type=str, nargs='+')

    args = parser.parse_args()
    args.func(args)
    
if __name__ == '__main__':
    main()
