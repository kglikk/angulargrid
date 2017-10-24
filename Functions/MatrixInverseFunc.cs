//Odwrócenie macierzy kwadratowych za pomocą Gauss-Jordan Elimination
//źródło http://csharphelper.com/blog/2016/05/find-matrix-inverse-c/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace angulargrid.Functions
{
    public class MatrixInverseFunc
    {
        public static double[,] Main(double[,] matrix)
        {
           int N_row = matrix.GetLength(0); //liczba wierszy
           int N_col = matrix.GetLength(1); //liczba kolumn

            // Find the inverse.
            double[,] inverse = InvertMatrix(matrix);

            if (inverse == null)
            {
                //Nie ma rozwiązania
            }
            else
            {
                // Multiply the matrix by the inverse.
                double[,] product = MultiplyMatrices(matrix, inverse);

                // Display the result          
            }
           // return matrixReplacement;
            return inverse;
        }

        // Return the matrix's inverse or null if it has none.
        static double[,] InvertMatrix(double[,] matrix)
        {
            const double tiny = 0.00001;

            // Build the augmented matrix.
            int num_rows = matrix.GetUpperBound(0) + 1;
            double[,] augmented = new double[num_rows, 2 * num_rows];
            for (int row = 0; row < num_rows; row++)
            {
                for (int col = 0; col < num_rows; col++)
                    augmented[row, col] = matrix[row, col];
                augmented[row, row + num_rows] = 1;
            }

            // num_cols is the number of the augmented matrix.
            int num_cols = 2 * num_rows;

            // Solve.
            for (int row = 0; row < num_rows; row++)
            {
                // Zero out all entries in column r after this row.
                // See if this row has a non-zero entry in column r.
                if (Math.Abs(augmented[row, row]) < tiny)
                {
                    // Too close to zero. Try to swap with a later row.
                    for (int r2 = row + 1; r2 < num_rows; r2++)
                    {
                        if (Math.Abs(augmented[r2, row]) > tiny)
                        {
                            // This row will work. Swap them.
                            for (int c = 0; c < num_cols; c++)
                            {
                                double tmp = augmented[row, c];
                                augmented[row, c] = augmented[r2, c];
                                augmented[r2, c] = tmp;
                            }
                            break;
                        }
                    }
                }

                // If this row has a non-zero entry in column r, use it.
                if (Math.Abs(augmented[row, row]) > tiny)
                {
                    // Divide the row by augmented[row, row] to make this entry 1.
                    for (int col = 0; col < num_cols; col++)
                        if (col != row)
                            augmented[row, col] /= augmented[row, row];
                    augmented[row, row] = 1;

                    // Subtract this row from the other rows.
                    for (int row2 = 0; row2 < num_rows; row2++)
                    {
                        if (row2 != row)
                        {
                            double factor = augmented[row2, row] / augmented[row, row];
                            for (int col = 0; col < num_cols; col++)
                                augmented[row2, col] -= factor * augmented[row, col];
                        }
                    }
                }
            }

            // See if we have a solution.
            if (augmented[num_rows - 1, num_rows - 1] == 0) return null;

            // Extract the inverse array.
            double[,] inverse = new double[num_rows, num_rows];
            for (int row = 0; row < num_rows; row++)
            {
                for (int col = 0; col < num_rows; col++)
                {
                    inverse[row, col] = augmented[row, col + num_rows];
                }
            }

            return inverse;
        }

        // Multiply two matrices.
        static double[,] MultiplyMatrices(double[,] m1, double[,] m2)
        {
            int num_rows = m1.GetUpperBound(0) + 1;
            double[,] result = new double[num_rows, num_rows];
            for (int row = 0; row < num_rows; row++)
            {
                for (int col = 0; col < num_rows; col++)
                {
                    double value = 0;
                    for (int i = 0; i < num_rows; i++)
                        value += m1[row, i] * m2[i, col];
                    result[row, col] = value;
                }
            }

            return result;
        }

    }
}