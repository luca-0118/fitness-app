#[derive(Debug)]
pub struct DataPoint {
    pub x: f64,      // workout number
    pub y: f64,      // e1RM
    pub weight: f64, // confidence weight
}

#[derive(Debug)]
pub struct LinearRegression {
    slope: f64,
    intercept: f64,
}

impl LinearRegression {
    pub fn fit(data: &[DataPoint]) -> Self {
        let mut sum_w = 0.0;
        let mut sum_wx = 0.0;
        let mut sum_wy = 0.0;
        let mut sum_wxy = 0.0;
        let mut sum_wx2 = 0.0;

        for point in data {
            let w = point.weight;
            let x = point.x;
            let y = point.y;

            // Zico: for each loop we update the sums of all values.
            sum_w += w;
            sum_wx += w * x;
            sum_wy += w * y;
            sum_wxy += w * x * y;
            sum_wx2 += w * x * x;
        }

        //Zico: mathmatical calculation for the slope
        let slope = (sum_w * sum_wxy - sum_wx * sum_wy) / (sum_w * sum_wx2 - sum_wx * sum_wx);

        //Zico: mathmatical calculation for the y-starting point.
        let intercept = (sum_wy - slope * sum_wx) / sum_w;

        //Zico: Store the slope and intercept in itself.
        Self { slope, intercept }
    }

    //Zico: Predict next value based on the slope and starting intercept.
    pub fn predict(&self, x: f64) -> f64 {
        self.slope * x + self.intercept
    }
}
