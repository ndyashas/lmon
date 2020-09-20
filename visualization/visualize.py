import argparse


if (__name__ == "__main__"):
    parser = argparse.ArgumentParser(description='lmon data visualization')

    parser.add_argument('-n', '--num-days', type=int,
                        default=1,
                        help='Number of past days to include in the graph. Default value of 1.')

    group = parser.add_mutually_exclusive_group(required=True)
    
    group.add_argument('-c', '--cpu', action='store_true',
                        help='Display CPU stats.')

    group.add_argument('-m', '--mem', action='store_true',
                        help='Display Memory stats.')
    
    group.add_argument('-l', '--logins', action='store_true',
                        help='Display login stats.')

    
    args = parser.parse_args()

    print(args)
