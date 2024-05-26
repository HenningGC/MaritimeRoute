import numpy as np
import matplotlib.pyplot as plt
import cartopy.io.shapereader as shpreader
import geopandas as gpd
from shapely.geometry import Point
import pandas as pd
import warnings
# Ignore all warnings
warnings.filterwarnings('ignore')

def import_data():

    return gpd.read_file('BackEnd/data/main_cells.shp')

def lat_lon_to_cartesian(lat, lon, radius=6371):
    """
    Convert latitude and longitude to Cartesian coordinates.
    The Earth's radius in kilometers is roughly 6371.
    """
    lat_rad = np.radians(lat)
    lon_rad = np.radians(lon)

    x = radius * np.cos(lat_rad) * np.cos(lon_rad)
    y = radius * np.cos(lat_rad) * np.sin(lon_rad)
    z = radius * np.sin(lat_rad)

    return x, y, z

# get center of cellx
def get_center_of_cell(cell_df, cell_index):
    return cell_df.loc[cell_index].geometry.centroid

def get_coordinates(cell_df, cell_index):
    x = get_center_of_cell(cell_df, cell_index).x
    y = get_center_of_cell(cell_df, cell_index).y

    return (float(x), float(y))
    #return (float(y), float(x))

def get_neighbours_idl(cell_df, cell_index):
    cell = cell_df.loc[cell_index]
    x, y = cell.geometry.centroid.x, cell.geometry.centroid.y

    if (x >= 179.805) or x <= -180:

        print('Cell is on the IDL')
        # if the cell is on the IDL, we need to find the closest cell on the other side
        if x >= 179.805:
            x = -178
        elif x <= -180:
            x = 178

    cell_df_distance = cell_df.copy()
    cell_df_distance['distance'] = cell_df_distance.geometry.distance(Point(x, y))

    return cell_df_distance.sort_values(by='distance').head(9)[1:][cell_df_distance['is_land'] == 0].index.to_list()

def find_closest_water_tile(lon, lat, geo_df):

    if lat < -90 or lat > 90:
        raise ValueError('Latitude must be between -90 and 90')
    if lon < -180 or lon > 180:
        raise ValueError('Longitude must be between -180 and 180')
    point = Point(lon, lat)

    closest_tile = geo_df[geo_df['is_land'] == False].distance(point).idxmin()
    return closest_tile

def euclidean_distance(coord_a, coord_b):
    """
    Calculate the Euclidean distance between two points in Cartesian coordinates.
    """
    return np.sqrt((coord_a[0] - coord_b[0]) ** 2 + (coord_a[1] - coord_b[1]) ** 2 + (coord_a[2] - coord_b[2]) ** 2)

def haversine_heuristic(tile_a_idx, tile_b_idx, cell_df):
    # Earth radius in kilometers
    R = 6371.0

    tile_a_centroid = get_center_of_cell(cell_df, tile_a_idx)
    tile_b_centroid = get_center_of_cell(cell_df, tile_b_idx)

    lat1, lon1 = np.radians(tile_a_centroid.y), np.radians(tile_a_centroid.x)
    lat2, lon2 = np.radians(tile_b_centroid.y), np.radians(tile_b_centroid.x)

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = np.sin(dlat / 2)**2 + np.cos(np.radians(lat1)) * np.cos(np.radians(lat2)) * np.sin(dlon / 2)**2
    c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1 - a))

    distance = R * c
    return distance

def euclidean_heuristic(tile_a_idx, tile_b_idx, cell_df):
    """
    Calculate the heuristic based on the Euclidean distance between the centroids of two tiles.
    """
    tile_a_centroid = get_center_of_cell(cell_df, tile_a_idx)
    tile_b_centroid = get_center_of_cell(cell_df, tile_b_idx)

    # Convert lat/lon to Cartesian coordinates for both tiles
    tile_a_cartesian = lat_lon_to_cartesian(tile_a_centroid.y, tile_a_centroid.x)
    tile_b_cartesian = lat_lon_to_cartesian(tile_b_centroid.y, tile_b_centroid.x)

    # Calculate the Euclidean distance
    distance = euclidean_distance(tile_a_cartesian, tile_b_cartesian)

    return distance


def execute_algorithm(start, end):
    cell_df = import_data()
    path = a_star_search(start, end, cell_df, heuristic=haversine_heuristic)
    return path

from queue import PriorityQueue
def a_star_search(start_coord, goal_coord, geo_df, heuristic):
    start_idx = find_closest_water_tile(start_coord[0], start_coord[1],geo_df)
    goal_idx = find_closest_water_tile(goal_coord[0], goal_coord[1],geo_df)

    frontier = PriorityQueue()
    frontier.put((0, start_idx))
    came_from = {start_idx: None}
    cost_so_far = {start_idx: 0}

    while not frontier.empty():
        current_idx = frontier.get()[1]
        print(current_idx)
        if current_idx == goal_idx:
            break  # Goal reached

        for next_idx in get_neighbours_idl(geo_df, current_idx):
            '''
            if next_idx in closed_list:
                continue
            '''
            new_cost = cost_so_far[current_idx] + 1#cost(current_idx, next_idx, geo_df) # cost(tile_a_idx, tile_b_idx, cell_df
            #print(next_idx,get_neighbours(geo_df, current_idx))
            if next_idx not in cost_so_far or new_cost < cost_so_far[next_idx]:
                cost_so_far[next_idx] = new_cost
                priority = new_cost + 1.5*heuristic(next_idx, goal_idx, geo_df)
                frontier.put((priority, next_idx))
                came_from[next_idx] = current_idx

    # Reconstruct path
    current = goal_idx
    coord_path = []
    print(came_from)
    while current != start_idx:
        c_coords = get_coordinates(geo_df, current)
        coord_path.append(c_coords)
        try:
            current = came_from[current]
        except:
            print('No path found')
            break
    start_idx_coords = get_coordinates(geo_df, start_idx)        
    coord_path.append(start_idx_coords)
    coord_path.reverse()

    return coord_path


