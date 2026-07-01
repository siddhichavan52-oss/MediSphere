class Factorial
{
    int n,ans;
    void input(int x)
    {
        n=x;
    }
    void calculate()
    {
        ans=1;
        for(int i=1;i<=n;i++)
        {
            ans=ans*i;
        }
        System.out.println("The factorial is: "+ans);
    }
}

class Fact
{
    public static void main(String[] args) 
    {
        Factorial obj1=new Factorial();
        obj1.input(5);
        obj1.calculate();
    }
}